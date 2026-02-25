import { useState, useEffect } from 'react';
import { type AnalysisResult } from '../types';
import { STORAGE_KEY } from '../constants';

export const useLocalStorage = () => {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  // Load analysis history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analysisHistory));
    } catch (error) {
      console.warn('Failed to save analysis history to localStorage:', error);
    }
  }, [analysisHistory]);

  return { analysisHistory, setAnalysisHistory };
};