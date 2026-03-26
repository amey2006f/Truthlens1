import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

/** Trim and strip accidental wrapping quotes from .env values */
const trimEnv = (value) => {
  if (value == null || value === '') return '';
  return String(value)
    .trim()
    .replace(/^["']|["']$/g, '');
};

const openaiApiKey = trimEnv(process.env.OPENAI_API_KEY);
const anthropicApiKey = trimEnv(process.env.ANTHROPIC_API_KEY);
const geminiApiKey = trimEnv(process.env.GEMINI_API_KEY);

if (!openaiApiKey) {
  console.warn(
    'Warning: OPENAI_API_KEY is not set. OpenAI-based models will not work until you configure it.'
  );
}
if (!anthropicApiKey) {
  console.warn(
    'Warning: ANTHROPIC_API_KEY is not set. Anthropic-based models will not work until you configure it.'
  );
}
if (!geminiApiKey) {
  console.warn(
    'Warning: GEMINI_API_KEY is not set. Gemini-based models will not work until you configure it.'
  );
}

const openaiClient = openaiApiKey
  ? new OpenAI({ apiKey: openaiApiKey })
  : null;
const genAI = geminiApiKey
  ? new GoogleGenerativeAI(geminiApiKey)
  : null;

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'truthlens-backend' });
});

// Endpoint to fetch and extract article content from URLs
app.post('/api/fetch-article', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Fetch the article content
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      maxRedirects: 5
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract main content - try multiple selectors
    let content = '';
    
    // Try to find article content using common selectors
    const selectors = [
      'article',
      '[role="main"]',
      '.article-body',
      '.post-content',
      '.entry-content',
      '.content',
      'main',
      '#content',
      '.main-content'
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        content = element.text().trim();
        break;
      }
    }

    // If no content found, try body text
    if (!content) {
      content = $('body').text().trim();
    }

    // Extract title
    let title = $('h1').first().text().trim() || $('title').text().trim() || 'No title found';

    // Clean up excessive whitespace
    content = content.replace(/\s+/g, ' ').trim();

    // Limit content length to avoid overwhelming the AI
    const maxLength = 5000;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength) + '...';
    }

    return res.json({
      success: true,
      url,
      title,
      content: content || 'Could not extract article content'
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return res.status(500).json({
      error: 'Failed to fetch article content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generic AI analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { prompt, content, task, modelKey, url } = req.body || {};

    if (!content || !prompt || !task) {
      return res.status(400).json({
        error: 'Missing required fields: prompt, content, task'
      });
    }

    const buildSystemMessage = (taskType) => {
      switch (taskType) {
        case 'bias':
          return (
            'You are an advanced Fake News Detection AI analyzing political bias in news articles. ' +
            'STRICT REQUIREMENTS: Respond ONLY with valid JSON, no additional text. ' +
            'Analyze these bias signals: emotional/manipulative language, one-sided sources, selective facts, loaded terminology, ' +
            'lack of opposing viewpoints, sensational framing, cherry-picked data. ' +
            'Respond with JSON having: ' +
            'bias_score (number -100 to 100: negative=left bias, positive=right bias, 0=center), ' +
            'source_reliability (number 0-100), ' +
            'political_leaning ("left" | "right" | "center" | "unknown"), ' +
            'bias_indicators (array with: type, description, severity, confidence, examples), ' +
            'key_findings (array of strings describing main bias signals), ' +
            'confidence (number 0-1). Only JSON, no markdown.'
          );
        case 'fact':
          return (
            'You are an advanced Fake News Detection AI analyzing factual accuracy. ' +
            'STRICT REQUIREMENTS: Respond ONLY with valid JSON, no additional text. ' +
            'Evaluate: presence of verifiable facts, supporting evidence, reliable sources, ' +
            'unsubstantiated claims, conspiracy language, misleading statistics, false attributions. ' +
            'Respond with JSON having: ' +
            'factual_accuracy (0-100), ' +
            'fake_probability (0-100: likelihood article contains misinformation), ' +
            'fake_signals (array: lack of sources, sensational headlines, conspiracy language, misleading claims), ' +
            'results (array of analyzed claims with: claim text, status, confidence, sources, explanation), ' +
            'key_findings (array of strings), ' +
            'confidence (0-1). Only JSON, no markdown.'
          );
        case 'sentiment':
          return (
            'You are an advanced Fake News Detection AI analyzing article sentiment. ' +
            'STRICT REQUIREMENTS: Respond ONLY with valid JSON, no additional text. ' +
            'Analyze emotional tone, loaded language intensity, sensationalism level. ' +
            'Respond with JSON having: ' +
            'sentiment ("positive" | "neutral" | "negative" | "mixed"), ' +
            'confidence (0-1), ' +
            'emotional_intensity (0-100), ' +
            'sensationalism_level (0-100: high=clickbait/emotional), ' +
            'emotional_triggers (array of detected emotional manipulation techniques). Only JSON, no markdown.'
          );
        case 'linguistic':
          return (
            'You are an advanced Fake News Detection AI analyzing linguistic features for misinformation signals. ' +
            'STRICT REQUIREMENTS: Respond ONLY with valid JSON, no additional text. ' +
            'Analyze: readability, emotional language, subjectivity, certainty claims, complexity, ' +
            'sensationalism, polarizing language, absolute claims ("always", "never"), vague sources ("they say"). ' +
            'Respond with JSON having: ' +
            'readability_score (0-100), emotional_intensity (0-100), subjectivity_score (0-100), ' +
            'certainty_level (0-100), complexity_score (0-100), sensationalism_score (0-100), ' +
            'polarizing_language (0-100), misinformation_signals (array of detected red flags), ' +
            'confidence (0-1). Only JSON, no markdown.'
          );
        case 'claims':
          return (
            'You are an advanced Fake News Detection AI extracting verifiable claims. ' +
            'STRICT REQUIREMENTS: Respond ONLY with valid JSON, no additional text. ' +
            'Extract ONLY testable claims, ignore general statements and opinions. ' +
            'For each claim identify: text, category, verifiability, current fact-check status. ' +
            'Respond with JSON field "claims" (array): ' +
            'id, text, category ("factual" | "opinion" | "statistical" | "prediction"), ' +
            'verifiability ("verifiable" | "unverifiable" | "subjective"), ' +
            'factCheckStatus ("verified_true" | "verified_false" | "disputed" | "unverified"), ' +
            'confidence (0-1), potential_sources (array). Only JSON, no markdown.'
          );
        case 'comprehensive':
          return (
            'You are an advanced Fake News Detection AI. Provide COMPREHENSIVE analysis. ' +
            'STRICT REQUIREMENTS: Respond ONLY with valid JSON, no additional text. ' +
            'Analyze credibility, bias, and fake news signals. ' +
            'Respond with JSON: ' +
            'credibility_score (0-100: based on factual accuracy + source reliability - bias impact), ' +
            'bias_score (-100 to 100), bias_type ("left" | "right" | "center" | "unknown"), ' +
            'sentiment ("positive" | "neutral" | "negative" | "mixed"), ' +
            'fake_probability (0-100), ' +
            'key_reasons (array of 3-5 main findings explaining the scores), ' +
            'quality_signals (object: has_sources, has_dates, has_author, structured_reporting), ' +
            'red_flags (array of detected misinformation indicators), ' +
            'confidence (0-1). Only JSON, no markdown.'
          );
        default:
          return null;
      }
    };

    const systemMessage = buildSystemMessage(task);

    if (!systemMessage) {
      return res.status(400).json({ error: `Unsupported task type: ${task}` });
    }

    const resolveProviderAndModel = (key) => {
      // Optional: force OpenAI model for GPT-style keys only (never override Gemini/Claude).
      const openaiOverride = trimEnv(process.env.OPENAI_MODEL);
      if (
        openaiOverride &&
        key !== 'gemini-2.5-flash' &&
        key !== 'claude-3-sonnet'
      ) {
        return { provider: 'openai', model: openaiOverride };
      }

      switch (key) {
        case 'gpt-4-turbo':
          return { provider: 'openai', model: 'gpt-4o' };
        case 'gpt-3.5-turbo':
          return { provider: 'openai', model: 'gpt-3.5-turbo' };
        case 'claude-3-sonnet':
          return {
            provider: 'anthropic',
            model: trimEnv(process.env.ANTHROPIC_MODEL) || 'claude-3-5-sonnet-latest'
          };
        case 'gemini-2.5-flash':
          return {
            provider: 'gemini',
            model: trimEnv(process.env.GEMINI_MODEL) || 'gemini-2.5-flash'
          };
        default:
          return { provider: 'openai', model: 'gpt-4.1-mini' };
      }
    };

    const { provider, model } = resolveProviderAndModel(modelKey);

    const userContent = `${prompt}\n\nARTICLE CONTENT:\n${content}\n\nARTICLE URL:\n${url || 'N/A'}`;

    let raw = '';

    if (provider === 'openai') {
      if (!openaiClient) {
        return res.status(500).json({
          error: 'OPENAI_API_KEY is not configured on the backend.'
        });
      }

      const chatCompletion = await openaiClient.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userContent }
        ],
        temperature: 0.3,
        max_tokens: 400
      });

      raw = chatCompletion.choices?.[0]?.message?.content || '';
    } else if (provider === 'anthropic') {
      if (!anthropicApiKey) {
        return res.status(500).json({
          error: 'ANTHROPIC_API_KEY is not configured on the backend.'
        });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 400,
          system: systemMessage,
          messages: [
            {
              role: 'user',
              content: userContent
            }
          ]
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error('Anthropic API error:', errBody);
        return res.status(500).json({
          error: 'Anthropic API request failed',
          details: errBody
        });
      }

      const data = await response.json();
      // Anthropic messages API returns content as an array of blocks
      raw =
        data.content?.[0]?.text ||
        data.content?.[0]?.content ||
        JSON.stringify(data);
    } else if (provider === 'gemini') {
      if (!genAI) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the backend.'
        });
      }

      const geminiModelId = model.replace(/^models\//, '');
      const geminiModel = genAI.getGenerativeModel({ model: geminiModelId });
      const promptText = `${systemMessage}\n\n${userContent}`;

      // Retry logic for handling temporary failures (e.g., 503 Service Unavailable)
      let result;
      let lastError;
      const maxRetries = 3;
      const baseDelay = 1000; // 1 second

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          result = await geminiModel.generateContent(promptText);
          lastError = null;
          break; // Success, exit retry loop
        } catch (err) {
          lastError = err;
          // Check if it's a retryable error (503, 429, timeout)
          const isRetryable = err.status === 503 || err.status === 429 || err.code === 'ETIMEDOUT';
          if (isRetryable && attempt < maxRetries - 1) {
            const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
            console.log(`Gemini API error (attempt ${attempt + 1}/${maxRetries}):`, err.status || err.code, `- Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw err;
          }
        }
      }

      if (lastError) {
        throw lastError;
      }

      const geminiResponse = result.response;
      raw = geminiResponse.text();
    } else {
      return res.status(400).json({
        error: `Unsupported provider: ${provider}`
      });
    }

    let parsed;
    try {
      // Extract JSON in case the model wraps it in backticks
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch (e) {
      console.error('Failed to parse model JSON:', e, 'raw:', raw);
      return res.status(500).json({
        error: 'Model returned invalid JSON',
        raw
      });
    }

    return res.json({
      data: parsed
    });
  } catch (err) {
    console.error('Error in /api/analyze:', err);
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      error: 'AI analysis failed on backend',
      details: message
    });
  }
});

app.listen(port, () => {
  console.log(`TruthLens backend listening on port ${port}`);
});

