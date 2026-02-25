import { useState } from 'react';
import { AnalysisResult, AnalysisInput } from '../types';
import { generateMockAnalysis, sleep } from '../utils/mockData';
import { ANALYSIS_STEPS, ANALYSIS_STEP_DELAY, FINAL_DELAY, MAX_HISTORY_ITEMS } from '../constants';
import { toast } from 'sonner@2.0.3';

interface UseAnalysisProps {
  setAnalysisHistory: React.Dispatch<React.SetStateAction<AnalysisResult[]>>;
}

export const useAnalysis = ({ setAnalysisHistory }: UseAnalysisProps) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const handleAnalysis = async (input: AnalysisInput) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalysis(null);
    
    try {
      // Simulate AI analysis with realistic progress
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        setCurrentStep(ANALYSIS_STEPS[i]);
        setAnalysisProgress((i + 1) * (100 / ANALYSIS_STEPS.length));
        await sleep(ANALYSIS_STEP_DELAY);
      }
      
      // Generate mock analysis results
      const analysis = generateMockAnalysis(input);

      await sleep(FINAL_DELAY);
      setCurrentAnalysis(analysis);
      setAnalysisHistory(prev => [analysis, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
      
      // Show success toast
      const credibilityScore = 100 - analysis.fakeNewsScore;
      toast.success('Analysis Complete!', {
        description: `Credibility: ${credibilityScore.toFixed(0)}% | Bias: ${analysis.biasDirection}`
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis Failed', {
        description: 'Please try again or contact support if the problem persists.'
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentStep('');
    }
  };

  return {
    currentAnalysis,
    setCurrentAnalysis,
    isAnalyzing,
    analysisProgress,
    currentStep,
    handleAnalysis
  };
};