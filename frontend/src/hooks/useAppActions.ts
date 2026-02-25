import type { AnalysisResult } from '../types';
import { toast } from 'sonner@2.0.3';

export const useAppActions = (currentAnalysis: AnalysisResult | null) => {
  const handleShare = async () => {
    if (currentAnalysis) {
      try {
        const shareData = {
          title: 'TruthLens Analysis Results',
          text: `Check out this article analysis: ${currentAnalysis.title}`,
          url: window.location.href
        };

        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Fallback for browsers that don't support Web Share API
          await navigator.clipboard.writeText(
            `${shareData.title}\n${shareData.text}\n${shareData.url}`
          );
          toast.success('Link copied to clipboard!');
        }
      } catch (error) {
        console.error('Sharing failed:', error);
        toast.error('Failed to share', {
          description: 'Please try copying the URL manually.'
        });
      }
    } else {
      toast.info('No analysis to share', {
        description: 'Analyze an article first to share results.'
      });
    }
  };

  const handleOpenSettings = () => {
    toast.info('Settings coming soon!', {
      description: 'User preferences and advanced settings will be available in the next update.'
    });
  };

  return { handleShare, handleOpenSettings };
};