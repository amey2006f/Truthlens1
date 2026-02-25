import { AnalysisResult, AnalysisInput, ANALYSIS_STEPS, MOCK_TITLES, MOCK_FINDINGS } from './types-and-constants';

// ==================== UTILITY FUNCTIONS ====================
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDateForCSV = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

export const calculateCredibilityScore = (fakeNewsScore: number): number => {
  return Math.max(0, Math.min(100, 100 - fakeNewsScore));
};

export const getBiasColor = (biasDirection: string): string => {
  switch (biasDirection) {
    case 'left': return 'text-blue-600 dark:text-blue-400';
    case 'right': return 'text-red-600 dark:text-red-400';
    case 'center': return 'text-green-600 dark:text-green-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

export const getCredibilityColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

// ==================== URL PROCESSING ====================
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const extractDomainFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown-domain';
  }
};

export const sanitizeText = (text: string): string => {
  return text.trim().slice(0, 50000); // Limit to 50k characters
};

// Enhanced URL content extraction with better error handling
export const extractArticleContent = async (url: string): Promise<{
  title: string;
  content: string;
  domain: string;
}> => {
  // In a real implementation, this would use a web scraping service.
  // Here we return a deterministic mock without randomness.
  
  const domain = extractDomainFromUrl(url);
  await sleep(1500); // fixed delay for UX

  const title = MOCK_TITLES[0];
  const content = generateRealisticArticleContent(domain, title);
  
  return { title, content, domain };
};

const generateRealisticArticleContent = (domain: string, title: string): string => {
  const paragraphs = [
    `This article from ${domain} discusses important developments in the story. The information presented here has been gathered from multiple sources and represents current understanding of the situation.`,
    `According to sources familiar with the matter, key stakeholders have been working to address the various concerns raised by the community and experts in the field.`,
    `The implications of these developments extend beyond the immediate scope and may have lasting effects on related policies and procedures going forward.`,
    `Analysis of the available data suggests that multiple factors contributed to the current situation, requiring a comprehensive approach to resolution.`,
    `Experts in the field have provided various perspectives on the matter, highlighting the complexity of the issues involved and the need for careful consideration.`
  ];
  
  const selectedParagraphs = paragraphs.slice(0, 3);
  
  return selectedParagraphs.join('\n\n');
};

// ==================== MOCK DATA GENERATION ====================
export const generateMockAnalysis = async (input: AnalysisInput): Promise<AnalysisResult> => {
  let title = 'User Submitted Article';
  let content = input.text || '';
  let domain = 'direct-input';
  
  // If URL is provided, extract deterministic mock content
  if (input.url) {
    const extracted = await extractArticleContent(input.url);
    title = extracted.title;
    content = extracted.content;
    domain = extracted.domain;
  }
  
  const fakeNewsScore = 55;
  const biasScore = -15;
  const sourceReliability = 75;

  const keyFindings = [
    MOCK_FINDINGS.SOURCE_HIGH,
    MOCK_FINDINGS.EMOTIONAL_LANGUAGE,
    MOCK_FINDINGS.PARTIALLY_VERIFIABLE,
    MOCK_FINDINGS.MULTIPLE_SOURCES
  ];

  return {
    id: Date.now().toString(),
    url: input.url,
    title,
    content,
    timestamp: new Date(),
    fakeNewsScore,
    biasScore,
    biasDirection: 'left',
    credibilityFactors: {
      sourceReliability,
      factualAccuracy: 80,
      emotionalLanguage: 65,
      sourceAttribution: 70,
    },
    keyFindings,
    sentiment: 'neutral',
    analysisSteps: ANALYSIS_STEPS,
    // AI-specific fields
    aiConfidence: 0.85,
    modelUsed: 'gpt-3.5-turbo',
    processingTime: 3000,
    detectedClaims: [],
    linguisticFeatures: {
      readabilityScore: 75,
      emotionalIntensity: 60,
      subjectivityScore: 55,
      certaintyLevel: 70,
      complexityScore: 65,
      sensationalismScore: 40,
      polarizingLanguage: 45
    },
    sourceAnalysis: {
      domain,
      domainAuthority: 80,
      historicalReliability: 85,
      expertiseRelevance: 78,
      transparencyScore: 82,
      editorialStandards: 80
    },
    factCheckResults: [],
    biasIndicators: []
  };
};

// ==================== EXPORT UTILITIES ====================
export const generateCSVData = (analyses: AnalysisResult[]): string => {
  const headers = [
    'Analysis ID',
    'Timestamp',
    'Title',
    'URL',
    'Domain',
    'Credibility Score',
    'Fake News Score',
    'Bias Direction',
    'Bias Score',
    'AI Confidence',
    'Model Used',
    'Processing Time (ms)',
    'Source Reliability',
    'Factual Accuracy',
    'Emotional Language',
    'Source Attribution',
    'Sentiment',
    'Key Findings Count',
    'Key Findings'
  ];

  const rows = analyses.map(analysis => [
    analysis.id,
    formatDateForCSV(analysis.timestamp),
    `"${analysis.title.replace(/"/g, '""')}"`,
    analysis.url || 'Direct Text Input',
    analysis.sourceAnalysis?.domain || 'N/A',
    calculateCredibilityScore(analysis.fakeNewsScore).toFixed(1),
    analysis.fakeNewsScore.toFixed(1),
    analysis.biasDirection,
    analysis.biasScore.toFixed(1),
    ((analysis.aiConfidence || 0) * 100).toFixed(1),
    analysis.modelUsed || 'N/A',
    (analysis.processingTime || 0).toString(),
    analysis.credibilityFactors.sourceReliability.toFixed(1),
    analysis.credibilityFactors.factualAccuracy.toFixed(1),
    analysis.credibilityFactors.emotionalLanguage.toFixed(1),
    analysis.credibilityFactors.sourceAttribution.toFixed(1),
    analysis.sentiment,
    analysis.keyFindings.length.toString(),
    `"${analysis.keyFindings.join('; ').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

export const generateJSONData = (analyses: AnalysisResult[]): string => {
  const exportData = analyses.map(analysis => ({
    ...analysis,
    credibilityScore: calculateCredibilityScore(analysis.fakeNewsScore),
    aiConfidencePercentage: (analysis.aiConfidence || 0) * 100,
    exportedAt: new Date().toISOString()
  }));

  return JSON.stringify(exportData, null, 2);
};

export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw new Error('Failed to download file. Please try again.');
  }
};

export const generateExportFilename = (format: 'csv' | 'json', analysisCount: number): string => {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `truthlens-analysis-${analysisCount}-results-${timestamp}.${format}`;
};

// ==================== DATA VALIDATION ====================
export const validateAnalysisInput = (input: AnalysisInput): { isValid: boolean; error?: string } => {
  if (!input.text && !input.url) {
    return { isValid: false, error: 'Please provide either a URL or article text to analyze' };
  }
  
  if (input.url && !isValidUrl(input.url)) {
    return { isValid: false, error: 'Please provide a valid HTTP or HTTPS URL' };
  }
  
  if (input.text && input.text.trim().length < 50) {
    return { isValid: false, error: 'Article text must be at least 50 characters long' };
  }
  
  if (input.text && input.text.length > 50000) {
    return { isValid: false, error: 'Article text cannot exceed 50,000 characters' };
  }
  
  return { isValid: true };
};

// ==================== SHARE UTILITIES ====================
export const generateShareText = (analysis: AnalysisResult): string => {
  const credibilityScore = calculateCredibilityScore(analysis.fakeNewsScore);
  return `TruthLens AI Analysis Results:
📰 "${analysis.title}"
📊 Credibility: ${credibilityScore.toFixed(1)}%
🤖 AI Confidence: ${((analysis.aiConfidence || 0) * 100).toFixed(1)}%
⚖️ Bias: ${analysis.biasDirection}
🔍 Analyzed by ${analysis.modelUsed}`;
};