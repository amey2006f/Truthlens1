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
}

export interface AnalysisInput {
  url?: string;
  text?: string;
}

export interface AppState {
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  isAnalyzing: boolean;
  analysisProgress: number;
  currentStep: string;
  activeTab: string;
  showExportDialog: boolean;
}

