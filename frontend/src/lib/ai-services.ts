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
      
      // Run parallel AI analyses
      const [
        biasAnalysis,
        factualAnalysis,
        sentimentAnalysis,
        linguisticAnalysis,
        claimsExtraction
      ] = await Promise.all([
        this.analyzeBias(content),
        this.analyzeFactuality(content),
        this.analyzeSentiment(content),
        this.analyzeLinguisticFeatures(content),
        this.extractClaims(content)
      ]);

      // Calculate overall scores
      const credibilityScore = this.calculateCredibilityScore({
        biasAnalysis,
        factualAnalysis,
        linguisticAnalysis
      });

      const processingTime = Date.now() - startTime;

      return {
        id: Date.now().toString(),
        url: input.url || '',
        title: await this.extractTitle(content),
        content: content.substring(0, 1000) + '...',
        timestamp: new Date(),
        fakeNewsScore: 100 - credibilityScore,
        biasScore: biasAnalysis.overallBias,
        biasDirection: this.determineBiasDirection(biasAnalysis.overallBias),
        credibilityFactors: {
          sourceReliability: biasAnalysis.sourceReliability,
          factualAccuracy: factualAnalysis.accuracy,
          emotionalLanguage: linguisticAnalysis.emotionalIntensity,
          sourceAttribution: factualAnalysis.sourceAttribution
        },
        keyFindings: this.generateKeyFindings({
          biasAnalysis,
          factualAnalysis,
          linguisticAnalysis
        }),
        sentiment: sentimentAnalysis.sentiment,
        aiConfidence: this.calculateConfidence({
          biasAnalysis,
          factualAnalysis,
          linguisticAnalysis
        }),
        modelUsed: this.config.selectedModel,
        processingTime,
        detectedClaims: claimsExtraction,
        linguisticFeatures: linguisticAnalysis,
        sourceAnalysis: await this.analyzeSource(input.url),
        factCheckResults: factualAnalysis.results,
        biasIndicators: biasAnalysis.indicators
      };
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw new Error('AI analysis failed. Please check your API configuration.');
    }
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

  private simulateContentExtraction(url: string): string {
    // Simulate realistic article content based on URL
    const domain = new URL(url).hostname;
    return `Article content from ${domain}. This is a simulated extraction of article content that would typically be obtained through web scraping or API integration. The content includes the main body text, headlines, and relevant metadata needed for comprehensive analysis.`;
  }

  private async callAIModel(
    prompt: string,
    content: string,
    task: 'bias' | 'fact' | 'sentiment' | 'linguistic' | 'claims' | 'source',
    url?: string
  ): Promise<any> {
    const backendUrl =
      (globalThis as any).VITE_BACKEND_URL || 'http://localhost:5000';
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
      throw new Error(errorBody.error || 'AI backend request failed');
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
    
    return {
      overallBias: response.bias_score,
      sourceReliability: response.source_reliability,
      indicators: response.bias_indicators as BiasIndicator[],
      confidence: response.confidence
    };
  }

  private async analyzeFactuality(content: string) {
    const response = await this.callAIModel(
      FACT_CHECK_PROMPTS.claims,
      content,
      'fact'
    );
    
    return {
      accuracy: response.factual_accuracy,
      sourceAttribution: response.source_attribution,
      results: response.results as FactCheckResult[],
      confidence: response.confidence
    };
  }

  private async analyzeSentiment(content: string) {
    return {
      // Reuse FACT_CHECK_PROMPTS.claims as a generic analysis prompt base
      ...(await this.callAIModel(
        FACT_CHECK_PROMPTS.claims,
        content,
        'sentiment'
      )),
    };
  }

  private async analyzeLinguisticFeatures(content: string): Promise<LinguisticFeatures> {
    const response = await this.callAIModel(
      FACT_CHECK_PROMPTS.claims,
      content,
      'linguistic'
    );

    return {
      readabilityScore: response.readability_score,
      emotionalIntensity: response.emotional_intensity,
      subjectivityScore: response.subjectivity_score,
      certaintyLevel: response.certainty_level,
      complexityScore: response.complexity_score,
      sensationalismScore: response.sensationalism_score,
      polarizingLanguage: response.polarizing_language
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
      domain: response.domain,
      domainAuthority: response.domainAuthority,
      historicalReliability: response.historicalReliability,
      expertiseRelevance: response.expertiseRelevance,
      transparencyScore: response.transparencyScore,
      editorialStandards: response.editorialStandards
    };
  }

  private async extractTitle(content: string): Promise<string> {
    // Extract title from content or generate one
    const lines = content.split('\n');
    return lines[0]?.substring(0, 100) || 'Article Analysis';
  }

  private calculateCredibilityScore(analyses: any): number {
    const { biasAnalysis, factualAnalysis, linguisticAnalysis } = analyses;
    
    const biasComponent = Math.max(0, 100 - Math.abs(biasAnalysis.overallBias));
    const factualComponent = factualAnalysis.accuracy;
    const linguisticComponent = Math.max(0, 100 - linguisticAnalysis.sensationalismScore);
    
    return (biasComponent * 0.3 + factualComponent * 0.5 + linguisticComponent * 0.2);
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
      selectedModel: 'gpt-3.5-turbo',
      analysisDepth: 'standard',
      enableFactChecking: true,
      enableBiasDetection: true,
      enableSentimentAnalysis: true,
      confidenceThreshold: 0.7
    };
  }
}