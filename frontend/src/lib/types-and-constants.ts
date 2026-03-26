// ==================== TYPES & INTERFACES ====================
export interface AnalysisResult {
  id: string;
  url?: string;
  title: string;
  content: string;
  timestamp: Date;
  fakeNewsScore: number;
  biasScore: number;
  biasDirection: 'left' | 'center' | 'right';
  credibilityFactors: {
    sourceReliability: number;
    factualAccuracy: number;
    emotionalLanguage: number;
    sourceAttribution: number;
  };
  keyFindings: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  analysisSteps?: string[];
  // New AI/ML fields
  aiConfidence: number;
  modelUsed: string;
  processingTime: number;
  detectedClaims: Claim[];
  linguisticFeatures: LinguisticFeatures;
  sourceAnalysis: SourceAnalysis;
  factCheckResults: FactCheckResult[];
  biasIndicators: BiasIndicator[];
}

export interface Claim {
  id: string;
  text: string;
  confidence: number;
  category: 'factual' | 'opinion' | 'statistical' | 'prediction';
  verifiability: 'verifiable' | 'unverifiable' | 'subjective';
  factCheckStatus: 'verified' | 'disputed' | 'false' | 'unverified';
  sources: string[];
}

export interface LinguisticFeatures {
  readabilityScore: number;
  emotionalIntensity: number;
  subjectivityScore: number;
  certaintyLevel: number;
  complexityScore: number;
  sensationalismScore: number;
  polarizingLanguage: number;
}

export interface SourceAnalysis {
  domain: string;
  domainAuthority: number;
  historicalReliability: number;
  expertiseRelevance: number;
  transparencyScore: number;
  editorialStandards: number;
}

export interface FactCheckResult {
  claim: string;
  status: 'true' | 'false' | 'mixed' | 'unverified';
  confidence: number;
  sources: string[];
  explanation: string;
}

export interface BiasIndicator {
  type: 'selection' | 'framing' | 'confirmation' | 'attribution' | 'omission';
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  examples: string[];
}

export interface AnalysisInput {
  url?: string;
  text?: string;
  analysisDepth?: 'quick' | 'standard' | 'comprehensive';
  focusAreas?: ('bias' | 'factuality' | 'sentiment' | 'credibility')[];
  modelPreference?: 'balanced' | 'conservative' | 'aggressive';
}

export interface AIConfig {
  openaiApiKey?: string;
  huggingfaceApiKey?: string;
  customEndpoint?: string;
  selectedModel: string;
  analysisDepth: 'quick' | 'standard' | 'comprehensive';
  enableFactChecking: boolean;
  enableBiasDetection: boolean;
  enableSentimentAnalysis: boolean;
  confidenceThreshold: number;
}

// ==================== AI/ML CONSTANTS ====================
export const AI_MODELS = {
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    strengths: ['Comprehensive Analysis', 'Nuanced Understanding'],
    speed: 'medium',
    accuracy: 'high'
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    strengths: ['Fast Processing', 'Good Balance'],
    speed: 'fast',
    accuracy: 'medium'
  },
  'claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    strengths: ['Careful Analysis', 'Bias Detection'],
    speed: 'medium',
    accuracy: 'high'
  },
  'gemini-2.5-flash': {
    name: 'gemini-2.5-flash',
    provider: 'Google',
    strengths: ['Fact Checking', 'Multi-modal'],
    speed: 'fast',
    accuracy: 'high'
  }
} as const;

export const ANALYSIS_STEPS = [
  'Preprocessing article content...',
  'Extracting key claims and statements...',
  'Running AI bias detection models...',
  'Performing fact-checking analysis...',
  'Analyzing linguistic patterns...',
  'Calculating credibility scores...',
  'Cross-referencing with reliable sources...',
  'Generating confidence metrics...',
  'Compiling final assessment...'
];

export const MOCK_FINDINGS = {
  SOURCE_HIGH: 'Source demonstrates high reliability and editorial standards',
  SOURCE_MODERATE: 'Source shows moderate reliability with some editorial concerns',
  SOURCE_LOW: 'Source has limited reliability and editorial oversight',
  EMOTIONAL_LANGUAGE: 'Article contains emotionally charged language that may influence reader perception',
  NEUTRAL_LANGUAGE: 'Article maintains neutral, factual language throughout',
  PARTIALLY_VERIFIABLE: 'Some claims in the article are partially verifiable through independent sources',
  WELL_SOURCED: 'Article provides comprehensive source attribution and references',
  LIMITED_ATTRIBUTION: 'Limited source attribution found for key claims',
  MULTIPLE_SOURCES: 'Article cites multiple independent sources for verification',
  RED_FLAGS: 'Several red flags detected that may indicate misinformation',
  NO_CONCERNS: 'No significant credibility concerns identified in the analysis',
  SENSATIONAL_HEADLINES: 'Headlines use sensationalized language to attract attention',
  FACTUAL_HEADLINES: 'Headlines accurately reflect article content without sensationalism',
  STATISTICAL_CLAIMS: 'Article contains statistical claims that require fact-checking',
  OPINION_BASED: 'Content is primarily opinion-based rather than factual reporting',
  POLITICAL_BIAS: 'Clear political bias detected in article framing and language',
  BALANCED_COVERAGE: 'Article provides balanced coverage of different perspectives',
  EXPERT_QUOTES: 'Article includes quotes from relevant experts and authorities',
  UNVERIFIED_CLAIMS: 'Contains unverified claims that lack supporting evidence'
} as const;

export const BIAS_DETECTION_PROMPTS = {
  political: `Analyze this article for political bias. Look for:
- Loaded language favoring one political side
- Selective presentation of facts
- Emotional appeals rather than logical arguments
- Unbalanced coverage of opposing viewpoints`,
  
  confirmation: `Identify confirmation bias indicators:
- Cherry-picking evidence
- Ignoring contradictory information
- Overconfidence in conclusions
- Dismissing alternative explanations`,
  
  framing: `Examine framing bias through:
- How issues are presented or contextualized
- What aspects are emphasized vs. downplayed
- Choice of metaphors and analogies
- Implicit assumptions in the narrative`
};

export const FACT_CHECK_PROMPTS = {
  claims: `Extract verifiable factual claims from this text. For each claim:
- Identify specific factual assertions
- Categorize as statistical, historical, scientific, etc.
- Assess verifiability with available sources
- Note any logical fallacies or unsupported leaps`,
  
  sources: `Evaluate source quality and attribution:
- Are sources clearly identified and credible?
- Do citations match the claims made?
- Are there conflicts of interest?
- Is the sourcing balanced and comprehensive?`
};

export const MOCK_TITLES = [
  'Breaking: Major Political Development Unfolds',
  'Scientists Announce Breakthrough Discovery',
  'Economic Markets Show Unexpected Trends',
  'Technology Giant Reveals New Innovation',
  'Health Officials Issue Important Statement',
  'Environmental Report Reveals New Data',
  'Global Trade Agreement Reaches Milestone',
  'Medical Research Shows Promising Results',
  'Education Reform Initiative Launches',
  'Infrastructure Project Gets Approval'
];

export const APP_CONFIG = {
  STORAGE_KEY: 'truthlens-analysis-history',
  AI_CONFIG_KEY: 'truthlens-ai-config',
  MAX_HISTORY_ITEMS: 50,
  ANALYSIS_STEP_DELAY: 1200,
  FINAL_DELAY: 800,
  MAX_ARTICLE_LENGTH: 50000,
  DEFAULT_CONFIDENCE_THRESHOLD: 0.7
} as const;