import { createBrowserRouter, Outlet, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { Header } from '../components/Header';
import { Toaster } from '../components/ui/sonner';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { HowItWorksPage } from '../pages/HowItWorksPage';
import { APIPage } from '../pages/APIPage';
import { useLocalStorage, useAnalyticsStats } from './hooks';
import { toast } from 'sonner@2.0.3';

// Error boundary component for handling route errors
function ErrorPage() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred';
  let errorStatus = 'Error';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data;
    errorStatus = error.status.toString();
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  // Use window.location to redirect instead of Navigate
  const handleRedirect = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="p-3 bg-destructive/10 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{errorStatus}</h1>
          <p className="text-muted-foreground mb-8">{errorMessage}</p>
          <button
            onClick={handleRedirect}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// Layout component that wraps all pages
function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { analysisHistory } = useLocalStorage();
  const stats = useAnalyticsStats(analysisHistory);

  const handleShare = async () => {
    try {
      if (stats.totalAnalyses > 0) {
        const shareText = `TruthLens AI Analysis Dashboard:
📊 Total Analyses: ${stats.totalAnalyses}
🎯 Average Credibility: ${stats.averageCredibility.toFixed(1)}%
🤖 AI Confidence: ${(stats.averageAIConfidence * 100).toFixed(1)}%
🔍 Powered by advanced AI models

Visit TruthLens for AI-powered fact-checking and bias detection.`;

        if (navigator.share) {
          await navigator.share({
            title: 'TruthLens - AI-Powered Analysis',
            text: shareText,
            url: window.location.href
          });
        } else {
          await navigator.clipboard.writeText(shareText);
          toast.success('Analysis summary copied to clipboard!');
        }
      } else {
        toast.info('No analysis to share', {
          description: 'Analyze some articles first to share results.'
        });
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      toast.error('Failed to share', {
        description: 'Please try copying the URL manually.'
      });
    }
  };

  const handleExportResults = () => {
    toast.info('Export feature', {
      description: 'This feature is available on the analysis page.'
    });
  };

  const handleOpenSettings = () => {
    toast.info('AI Settings', {
      description: 'Configure AI models and analysis preferences on the main page.'
    });
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header
        onThemeToggle={toggleTheme}
        isDarkMode={theme === 'dark'}
        {...(stats.totalAnalyses > 0 ? { onExportResults: handleExportResults } : {})}
        onShare={handleShare}
        onOpenSettings={handleOpenSettings}
      />
      <main>
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
    </div>
  );
}

// Handle preview_page.html redirect
function PreviewRedirect() {
  // Use window.location for redirect instead of Navigate
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to home...</p>
      </div>
    </div>
  );
}

// Catch-all redirect component
function NotFoundRedirect() {
  // Use window.location for redirect instead of Navigate
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to home...</p>
      </div>
    </div>
  );
}

// Router configuration (separate module so `router.tsx` can export only AppRouter for Fast Refresh)
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'how-it-works',
        element: <HowItWorksPage />
      },
      {
        path: 'api',
        element: <APIPage />
      }
    ]
  },
  {
    path: '/preview_page.html',
    element: <PreviewRedirect />
  },
  {
    path: '*',
    element: <NotFoundRedirect />
  }
]);
