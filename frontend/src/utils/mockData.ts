import type { AnalysisResult, AnalysisInput } from '../types';
import { ANALYSIS_STEPS, MOCK_TITLES, MOCK_FINDINGS } from '../constants';

export const generateMockAnalysis = (input: AnalysisInput): AnalysisResult => {
  // Deterministic placeholder values (no randomness) purely for legacy mock usage.
  const fakeNewsScore = 55; // mid-level risk
  const biasScore = -15; // slight left bias
  const sourceReliability = 75;

  const keyFindings = [
    MOCK_FINDINGS.SOURCE_HIGH,
    MOCK_FINDINGS.EMOTIONAL_LANGUAGE,
    MOCK_FINDINGS.PARTIALLY_VERIFIABLE,
    MOCK_FINDINGS.MULTIPLE_SOURCES
  ];

  const titleFromList: string = MOCK_TITLES[0] ?? 'Article Title';

  const title: string =
    input.url && input.url.length > 0 ? titleFromList : 'User Submitted Article';

  const content: string =
    input.text && input.text.length > 0
      ? input.text
      : 'Article content extracted from URL...';

  return {
    id: Date.now().toString(),
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
    analysisSteps: ANALYSIS_STEPS
  };
};

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));