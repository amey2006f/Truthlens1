import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const openaiApiKey = process.env.OPENAI_API_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

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
            'You are an AI that analyzes news article bias. ' +
            'Respond with a single JSON object with fields: ' +
            'bias_score (number -100 to 100), ' +
            'source_reliability (number 0-100), ' +
            'political_leaning ("left" | "right" | "center"), ' +
            'bias_indicators (array of objects with fields: ' +
            'type ("selection" | "framing" | "confirmation" | "attribution" | "omission"), ' +
            'description (string), severity ("low" | "medium" | "high"), ' +
            'confidence (number 0-1), examples (array of strings)). ' +
            'No extra text, only JSON.'
          );
        case 'fact':
          return (
            'You are an AI that analyzes factual accuracy of news articles. ' +
            'Respond with a single JSON object with fields: ' +
            'factual_accuracy (number 0-100), ' +
            'source_attribution (number 0-100), ' +
            'results (array of objects with fields: ' +
            'claim (string), status ("true" | "false" | "mixed" | "unverified"), ' +
            'confidence (number 0-1), sources (array of strings), explanation (string)). ' +
            'No extra text, only JSON.'
          );
        case 'sentiment':
          return (
            'You are an AI that analyzes sentiment of news articles. ' +
            'Respond with a single JSON object with fields: ' +
            'sentiment ("positive" | "neutral" | "negative"), ' +
            'confidence (number 0-1), emotional_intensity (number 0-100). ' +
            'No extra text, only JSON.'
          );
        case 'linguistic':
          return (
            'You are an AI that analyzes linguistic features of news articles. ' +
            'Respond with a single JSON object with fields: ' +
            'readability_score (number 0-100), emotional_intensity (number 0-100), ' +
            'subjectivity_score (number 0-100), certainty_level (number 0-100), ' +
            'complexity_score (number 0-100), sensationalism_score (number 0-100), ' +
            'polarizing_language (number 0-100). ' +
            'No extra text, only JSON.'
          );
        case 'claims':
          return (
            'You are an AI that extracts verifiable claims from news articles. ' +
            'Respond with a single JSON object with field "claims" which is an array of objects ' +
            'with fields: id (string), text (string), confidence (number 0-1), ' +
            'category ("factual" | "opinion" | "statistical" | "prediction"), ' +
            'verifiability ("verifiable" | "unverifiable" | "subjective"), ' +
            'factCheckStatus ("verified" | "disputed" | "false" | "unverified"), ' +
            'sources (array of strings). No extra text, only JSON.'
          );
        case 'source':
          return (
            'You are an AI that analyzes the reliability of news sources. ' +
            'Use both the article content and the URL/domain (if provided). ' +
            'Respond with a single JSON object with fields: ' +
            'domain (string), domainAuthority (number 0-100), ' +
            'historicalReliability (number 0-100), expertiseRelevance (number 0-100), ' +
            'transparencyScore (number 0-100), editorialStandards (number 0-100). ' +
            'No extra text, only JSON.'
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
      // If a global override is set, always use OpenAI with that model.
      if (process.env.OPENAI_MODEL) {
        return { provider: 'openai', model: process.env.OPENAI_MODEL };
      }

      switch (key) {
        case 'gpt-4-turbo':
          return { provider: 'openai', model: 'gpt-4o' };
        case 'gpt-3.5-turbo':
          return { provider: 'openai', model: 'gpt-3.5-turbo' };
        case 'claude-3-sonnet':
          return {
            provider: 'anthropic',
            model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest'
          };
        case 'gemini-pro':
          return {
            provider: 'gemini',
            model: process.env.GEMINI_MODEL || 'gemini-1.5-pro'
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

  const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"

  });

  const result = await geminiModel.generateContent(
    `${systemMessage}\n\n${userContent}`
  );

  const response = await result.response;
  raw = response.text();
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
    return res.status(500).json({
      error: 'AI analysis failed on backend'
    });
  }
});

app.listen(port, () => {
  console.log(`TruthLens backend listening on port ${port}`);
});

