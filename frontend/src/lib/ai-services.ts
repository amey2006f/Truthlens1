import type { AnalysisResult, AnalysisInput, AIConfig, Claim, LinguisticFeatures, FactCheckResult, BiasIndicator } from './types-and-constants';
import { AI_MODELS, BIAS_DETECTION_PROMPTS, FACT_CHECK_PROMPTS } from './types-and-constants';

// ==================== AI SERVICE CLASSES ====================
export class AIAnalysisService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async analyzeArticle(input: AnalysisInput): Promise<AnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Extract and preprocess content
      const content = await this.preprocessContent(input);
      
      // Check if we have minimal content for analysis
      if (content.length < 100) {
        throw new Error('Insufficient article content for accurate analysis');
      }

      // Run COMPREHENSIVE AI analysis (single call instead of multiple)
      const comprehensiveAnalysis = await this.callAIModel(
        'Perform comprehensive fake news detection analysis on this article.',
        content,
        'comprehensive',
        input.url
      );

      // Extract all metrics from comprehensive response
      const credibilityScore = comprehensiveAnalysis.credibility_score ?? 50;
      const fakeNewsScore = 100 - credibilityScore;
      const biasScore = comprehensiveAnalysis.bias_score ?? 0;
      const sentiment = comprehensiveAnalysis.sentiment ?? 'neutral';
      const fakeProbability = comprehensiveAnalysis.fake_probability ?? 0;

      const processingTime = Date.now() - startTime;

      return {
        id: Date.now().toString(),
        url: input.url || '',
        title: await this.extractTitle(content),
        content: content.substring(0, 500) + '...',
        timestamp: new Date(),
        fakeNewsScore: Math.round(fakeProbability),
        biasScore: biasScore,
        biasDirection: this.determineBiasDirection(biasScore),
        credibilityFactors: {
          sourceReliability: comprehensiveAnalysis.quality_signals?.has_sources ? 75 : 50,
          factualAccuracy: credibilityScore,
          emotionalLanguage: comprehensiveAnalysis.red_flags?.length > 2 ? 70 : 30,
          sourceAttribution: comprehensiveAnalysis.quality_signals?.has_author ? 80 : 40
        },
        keyFindings: comprehensiveAnalysis.key_reasons || [
          'Analysis completed',
          'Review assessment carefully',
          'Cross-reference with official sources'
        ],
        sentiment: sentiment,
        aiConfidence: comprehensiveAnalysis.confidence ?? 0.7,
        modelUsed: this.config.selectedModel,
        processingTime,
        detectedClaims: comprehensiveAnalysis.verified_claims || [],
        linguisticFeatures: {
          readabilityScore: comprehensiveAnalysis.readability_score ?? 65,
          emotionalIntensity: comprehensiveAnalysis.emotional_intensity ?? 40,
          subjectivityScore: comprehensiveAnalysis.subjectivity_score ?? 50,
          certaintyLevel: comprehensiveAnalysis.certainty_level ?? 70,
          complexityScore: comprehensiveAnalysis.complexity_score ?? 55,
          sensationalismScore: comprehensiveAnalysis.sensationalism_score ?? 35,
          polarizingLanguage: comprehensiveAnalysis.polarizing_language ?? 30
        },
        sourceAnalysis: {
          domain: input.url ? new URL(input.url).hostname : 'unknown',
          domainAuthority: comprehensiveAnalysis.domain_authority ?? 65,
          historicalReliability: comprehensiveAnalysis.source_reliability ?? 70,
          expertiseRelevance: 65,
          transparencyScore: comprehensiveAnalysis.quality_signals?.has_author ? 75 : 50,
          editorialStandards: 65
        },
        factCheckResults: comprehensiveAnalysis.claims || [],
        biasIndicators: comprehensiveAnalysis.red_flags || []
      };
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw new Error('AI analysis failed. Please check your API configuration.');
    }
  }

  private getDefaultBiasAnalysis() {
    return {
      overallBias: 0,
      sourceReliability: 70,
      indicators: [] as BiasIndicator[],
      confidence: 0.5
    };
  }

  private async preprocessContent(input: AnalysisInput): Promise<string> {
    if (input.text) {
      return input.text.trim();
    }
    
    if (input.url) {
      // In a real implementation, this would fetch and extract article content
      // For now, we'll simulate this with mock content
      return this.simulateContentExtraction(input.url);
    }
    
    throw new Error('No content provided for analysis');
  }

  private async simulateContentExtraction(url: string): Promise<string> {
    try {
      // Fetch real article content from the URL
      const response = await fetch('/api/fetch-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content || data.text || 'No content extracted from URL';
    } catch (error) {
      console.error('Error fetching article content from URL:', error);
      // Fallback: return error message so AI can process
      return `Unable to fetch article content from ${url}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private async callAIModel(
    prompt: string,
    content: string,
    task: 'bias' | 'fact' | 'sentiment' | 'linguistic' | 'claims' | 'source' | 'comprehensive',
    url?: string
  ): Promise<any> {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        content,
        task,
        url,
        modelKey: this.config.selectedModel
      })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error('Backend AI error:', errorBody);
      const detail =
        typeof (errorBody as { details?: string }).details === 'string'
          ? (errorBody as { details: string }).details
          : '';
      const message =
        (errorBody as { error?: string }).error || 'AI backend request failed';
      throw new Error(detail ? `${message}: ${detail}` : message);
    }

    const json = await response.json();

    // Attach some generic metadata expected by downstream code
    return {
      ...(json.data || {}),
      confidence: 0.85,
      processing_time: 1500,
      model: this.config.selectedModel
    };
  }

  private async analyzeBias(content: string) {
    const response = await this.callAIModel(
      BIAS_DETECTION_PROMPTS.political,
      content,
      'bias'
    );

    // Some model outputs may omit `bias_score` and only provide `political_leaning`.
    // Fallback keeps the UI consistent even with partial model responses.
    const rawBiasScore = (response as { bias_score?: unknown }).bias_score;
    const politicalLeaning = (response as { political_leaning?: unknown }).political_leaning;

    let overallBias: number;
    if (typeof rawBiasScore === 'number' && Number.isFinite(rawBiasScore)) {
      overallBias = rawBiasScore;
    } else {
      switch (politicalLeaning) {
        case 'left':
          overallBias = -50;
          break;
        case 'right':
          overallBias = 50;
          break;
        case 'center':
        default:
          overallBias = 0;
          break;
      }
    }

    return {
      overallBias,
      sourceReliability:
        typeof response.source_reliability === 'number' && Number.isFinite(response.source_reliability)
          ? response.source_reliability
          : 70,
      indicators: (response.bias_indicators || []) as BiasIndicator[],
      confidence:
        typeof response.confidence === 'number' && Number.isFinite(response.confidence)
          ? response.confidence
          : 0.6
    };
  }

  private async analyzeFactuality(content: string) {
    const response = await this.callAIModel(
      FACT_CHECK_PROMPTS.claims,
      content,
      'fact'
    );
    
    return {
      accuracy: typeof response.factual_accuracy === 'number' ? response.factual_accuracy : 75,
      sourceAttribution: typeof response.source_attribution === 'number' ? response.source_attribution : 70,
      results: (response.results ?? []) as FactCheckResult[],
      confidence: typeof response.confidence === 'number' ? response.confidence : 0.7
    };
  }

  private async analyzeSentiment(content: string) {
    const response = await this.callAIModel(
      FACT_CHECK_PROMPTS.claims,
      content,
      'sentiment'
    );
    
    return {
      sentiment: response.sentiment ?? 'neutral',
      confidence: typeof response.confidence === 'number' ? response.confidence : 0.7,
      emotional_intensity: typeof response.emotional_intensity === 'number' ? response.emotional_intensity : 40
    };
  }

  private async analyzeLinguisticFeatures(content: string): Promise<LinguisticFeatures> {
    const response = await this.callAIModel(
      FACT_CHECK_PROMPTS.claims,
      content,
      'linguistic'
    );

    return {
      readabilityScore: typeof response.readability_score === 'number' ? response.readability_score : 65,
      emotionalIntensity: typeof response.emotional_intensity === 'number' ? response.emotional_intensity : 40,
      subjectivityScore: typeof response.subjectivity_score === 'number' ? response.subjectivity_score : 50,
      certaintyLevel: typeof response.certainty_level === 'number' ? response.certainty_level : 70,
      complexityScore: typeof response.complexity_score === 'number' ? response.complexity_score : 55,
      sensationalismScore: typeof response.sensationalism_score === 'number' ? response.sensationalism_score : 35,
      polarizingLanguage: typeof response.polarizing_language === 'number' ? response.polarizing_language : 30
    } as LinguisticFeatures;
  }

  private async extractClaims(content: string): Promise<Claim[]> {
    const response = await this.callAIModel(
      FACT_CHECK_PROMPTS.claims,
      content,
      'claims'
    );

    return (response.claims || []) as Claim[];
  }

  private async analyzeSource(url?: string) {
    const contentForSource =
      url ?? 'No URL provided. Analyze the source reliability from content only.';

    const response = await this.callAIModel(
      'Analyze the reliability of the news source.',
      contentForSource,
      'source',
      url
    );

    return {
      domain: response.domain ?? 'unknown',
      domainAuthority: typeof response.domainAuthority === 'number' ? response.domainAuthority : 65,
      historicalReliability: typeof response.historicalReliability === 'number' ? response.historicalReliability : 65,
      expertiseRelevance: typeof response.expertiseRelevance === 'number' ? response.expertiseRelevance : 60,
      transparencyScore: typeof response.transparencyScore === 'number' ? response.transparencyScore : 60,
      editorialStandards: typeof response.editorialStandards === 'number' ? response.editorialStandards : 65
    };
  }

  private async extractTitle(content: string): Promise<string> {
    // Extract title from content or generate one
    const lines = content.split('\n');
    return lines[0]?.substring(0, 100) || 'Article Analysis';
  }

  private calculateCredibilityScore(analyses: any, biasEnabled: boolean): number {
    const { biasAnalysis, factualAnalysis, linguisticAnalysis } = analyses;
    
    const biasComponent = Math.max(0, 100 - Math.abs(biasAnalysis.overallBias));
    const factualComponent = factualAnalysis.accuracy ?? 50;
    const linguisticComponent = Math.max(0, 100 - (linguisticAnalysis.sensationalismScore ?? 50));

    const biasWeight = biasEnabled ? 0.3 : 0;
    const factualWeight = 0.5;
    const linguisticWeight = 0.2;
    const totalWeight = biasWeight + factualWeight + linguisticWeight;

    // Normalize weights to always sum to 1.0, preventing division issues
    const normalizedBiasWeight = totalWeight > 0 ? biasWeight / totalWeight : 0;
    const normalizedFactualWeight = totalWeight > 0 ? factualWeight / totalWeight : 0;
    const normalizedLinguisticWeight = totalWeight > 0 ? linguisticWeight / totalWeight : 0;

    return Math.round(
      biasComponent * normalizedBiasWeight +
      factualComponent * normalizedFactualWeight +
      linguisticComponent * normalizedLinguisticWeight
    );
  }

  private calculateConfidence(analyses: any): number {
    const confidences = [
      analyses.biasAnalysis.confidence,
      analyses.factualAnalysis.confidence,
      analyses.linguisticAnalysis.confidence || 0.8
    ];
    
    return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
  }

  private determineBiasDirection(biasScore: number): 'left' | 'center' | 'right' {
    if (Math.abs(biasScore) < 20) return 'center';
    return biasScore > 0 ? 'right' : 'left';
  }

  private generateKeyFindings(analyses: any): string[] {
    const findings = [];
    
    if (analyses.biasAnalysis.sourceReliability > 70) {
      findings.push('Source demonstrates high reliability');
    } else {
      findings.push('Source reliability concerns identified');
    }
    
    if (analyses.factualAnalysis.accuracy > 80) {
      findings.push('High factual accuracy detected');
    } else if (analyses.factualAnalysis.accuracy < 60) {
      findings.push('Multiple factual inaccuracies found');
    }
    
    if (analyses.linguisticAnalysis.sensationalismScore > 70) {
      findings.push('Highly sensationalized language detected');
    }
    
    if (Math.abs(analyses.biasAnalysis.overallBias) > 50) {
      findings.push('Strong political bias detected');
    }
    
    return findings.slice(0, 5);
  }
}

// ==================== AI CONFIGURATION MANAGER ====================
export class AIConfigManager {
  private static readonly CONFIG_KEY = 'truthlens-ai-config';

  static getConfig(): AIConfig {
    try {
      const saved = localStorage.getItem(this.CONFIG_KEY);
      if (saved) {
        return { ...this.getDefaultConfig(), ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load AI config:', error);
    }
    
    return this.getDefaultConfig();
  }

  static saveConfig(config: Partial<AIConfig>): void {
    try {
      const currentConfig = this.getConfig();
      const newConfig = { ...currentConfig, ...config };
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Failed to save AI config:', error);
    }
  }

  private static getDefaultConfig(): AIConfig {
    return {
      selectedModel: 'gemini-2.5-flash',
      analysisDepth: 'standard',
      enableFactChecking: true,
      enableBiasDetection: true,
      enableSentimentAnalysis: true,
      confidenceThreshold: 0.7
    };
  }
}