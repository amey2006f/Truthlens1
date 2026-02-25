import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { AnalysisResult, AnalysisInput, AIConfig, APP_CONFIG, ANALYSIS_STEPS } from './types-and-constants';
import { AIAnalysisService, AIConfigManager } from './ai-services';

// ==================== LOCALSTORAGE HOOK ====================
export const useLocalStorage = () => {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  // Load analysis history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsedHistory.map((analysis: any) => ({
          ...analysis,
          timestamp: new Date(analysis.timestamp)
        }));
        setAnalysisHistory(historyWithDates);
      }
    } catch (error) {
      console.warn('Failed to load analysis history from localStorage:', error);
    }
  }, []);

  // Save analysis history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(analysisHistory));
    } catch (error) {
      console.warn('Failed to save analysis history to localStorage:', error);
    }
  }, [analysisHistory]);

  return { analysisHistory, setAnalysisHistory };
};

// ==================== AI CONFIGURATION HOOK ====================
export const useAIConfig = () => {
  const [config, setConfig] = useState<AIConfig>(AIConfigManager.getConfig());

  const updateConfig = (newConfig: Partial<AIConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    AIConfigManager.saveConfig(updatedConfig);
  };

  return { config, updateConfig };
};

// ==================== ENHANCED ANALYSIS HOOK ====================
interface UseAnalysisProps {
  setAnalysisHistory: React.Dispatch<React.SetStateAction<AnalysisResult[]>>;
}

export const useAnalysis = ({ setAnalysisHistory }: UseAnalysisProps) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { config } = useAIConfig();

  const handleAnalysis = async (input: AnalysisInput) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalysis(null);
    setAnalysisError(null);
    
    try {
      // Validate input
      if (!input.text && !input.url) {
        throw new Error('Please provide either a URL or article text to analyze');
      }

      if (input.url && !isValidUrl(input.url)) {
        throw new Error('Please provide a valid URL');
      }

      // Initialize AI service
      const aiService = new AIAnalysisService(config);

      // Simulate realistic AI analysis progress
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        setCurrentStep(ANALYSIS_STEPS[i]);
        setAnalysisProgress((i + 1) * (100 / ANALYSIS_STEPS.length));
        
        // Variable delay based on analysis step complexity
        const stepDelay = i < 3 ? APP_CONFIG.ANALYSIS_STEP_DELAY : APP_CONFIG.ANALYSIS_STEP_DELAY * 1.5;
        await sleep(stepDelay);
      }
      
      // Perform AI analysis
      const analysis = await aiService.analyzeArticle(input);

      setCurrentAnalysis(analysis);
      setAnalysisHistory(prev => [analysis, ...prev.slice(0, APP_CONFIG.MAX_HISTORY_ITEMS - 1)]);
      
      // Show detailed success toast
      const credibilityScore = 100 - analysis.fakeNewsScore;
      toast.success('AI Analysis Complete!', {
        description: `Credibility: ${credibilityScore.toFixed(1)}% | Confidence: ${(analysis.aiConfidence * 100).toFixed(1)}% | Model: ${analysis.modelUsed}`
      });
      
    } catch (error: any) {
      console.error('AI Analysis failed:', error);
      setAnalysisError(error.message || 'Analysis failed');
      
      toast.error('Analysis Failed', {
        description: error.message || 'Please check your configuration and try again.'
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentStep('');
    }
  };

  const retryAnalysis = () => {
    setAnalysisError(null);
  };

  return {
    currentAnalysis,
    setCurrentAnalysis,
    isAnalyzing,
    analysisProgress,
    currentStep,
    analysisError,
    handleAnalysis,
    retryAnalysis
  };
};

// ==================== APP ACTIONS HOOK ====================
export const useAppActions = (currentAnalysis: AnalysisResult | null) => {
  const handleShare = async () => {
    if (currentAnalysis) {
      try {
        const credibilityScore = (100 - currentAnalysis.fakeNewsScore).toFixed(1);
        const shareData = {
          title: 'TruthLens AI Analysis Results',
          text: `AI-powered analysis of "${currentAnalysis.title}"\n📊 Credibility: ${credibilityScore}%\n🤖 AI Confidence: ${(currentAnalysis.aiConfidence * 100).toFixed(1)}%\n⚖️ Bias: ${currentAnalysis.biasDirection}`,
          url: window.location.href
        };

        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Fallback for browsers that don't support Web Share API
          await navigator.clipboard.writeText(
            `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
          );
          toast.success('Analysis results copied to clipboard!');
        }
      } catch (error) {
        console.error('Sharing failed:', error);
        toast.error('Failed to share', {
          description: 'Please try copying the URL manually.'
        });
      }
    } else {
      toast.info('No analysis to share', {
        description: 'Analyze an article first to share AI-powered results.'
      });
    }
  };

  const handleOpenSettings = () => {
    toast.info('AI Settings', {
      description: 'Configure AI models, analysis depth, and API keys in the settings panel.'
    });
  };

  return { handleShare, handleOpenSettings };
};

// ==================== THEME HOOK ====================
export const useThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('truthlens-theme');
      return saved === 'dark';
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('truthlens-theme', newTheme ? 'dark' : 'light');
      if (newTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleTheme };
};

// ==================== ENHANCED ANALYTICS HOOK ====================
export const useAnalyticsStats = (analysisHistory: AnalysisResult[]) => {
  const totalAnalyses = analysisHistory.length;
  
  const averageCredibility = totalAnalyses > 0 
    ? analysisHistory.reduce((sum, a) => sum + (100 - a.fakeNewsScore), 0) / totalAnalyses
    : 0;

  const averageAIConfidence = totalAnalyses > 0
    ? analysisHistory.reduce((sum, a) => sum + (a.aiConfidence || 0), 0) / totalAnalyses
    : 0;

  const biasDistribution = analysisHistory.reduce((acc, analysis) => {
    acc[analysis.biasDirection] = (acc[analysis.biasDirection] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const modelUsage = analysisHistory.reduce((acc, analysis) => {
    if (analysis.modelUsed) {
      acc[analysis.modelUsed] = (acc[analysis.modelUsed] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const averageProcessingTime = totalAnalyses > 0
    ? analysisHistory.reduce((sum, a) => sum + (a.processingTime || 0), 0) / totalAnalyses
    : 0;

  const recentAnalyses = analysisHistory.slice(0, 5);

  const highConfidenceAnalyses = analysisHistory.filter(a => (a.aiConfidence || 0) > 0.8).length;

  return {
    totalAnalyses,
    averageCredibility,
    averageAIConfidence,
    biasDistribution,
    modelUsage,
    averageProcessingTime,
    recentAnalyses,
    highConfidenceAnalyses,
    confidenceRate: totalAnalyses > 0 ? (highConfidenceAnalyses / totalAnalyses) * 100 : 0
  };
};

// ==================== UTILITY FUNCTIONS ====================
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ==================== MODEL PERFORMANCE HOOK ====================
export const useModelPerformance = () => {
  const [performanceData, setPerformanceData] = useState<Record<string, any>>({});

  const trackModelPerformance = (modelName: string, metrics: {
    processingTime: number;
    confidence: number;
    accuracy?: number;
  }) => {
    setPerformanceData(prev => ({
      ...prev,
      [modelName]: {
        ...prev[modelName],
        totalRuns: (prev[modelName]?.totalRuns || 0) + 1,
        avgProcessingTime: prev[modelName] 
          ? (prev[modelName].avgProcessingTime + metrics.processingTime) / 2
          : metrics.processingTime,
        avgConfidence: prev[modelName]
          ? (prev[modelName].avgConfidence + metrics.confidence) / 2
          : metrics.confidence,
        lastUsed: new Date()
      }
    }));
  };

  return { performanceData, trackModelPerformance };
};