import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSection } from '../components/HeroSection';
import { ArticleInput } from '../components/ArticleInput';
import { AnalysisResults } from '../components/AnalysisResults';
import { AnalysisHistory } from '../components/AnalysisHistory';
import { AnalysisProgress } from '../components/AnalysisProgress';
import { StatsOverview } from '../components/StatsOverview';
import { AISettings } from '../components/AISettings';
import { ExportDialog } from '../components/ExportDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Brain, Sparkles, Shield, BarChart3 } from 'lucide-react';
import { useLocalStorage, useAnalysis, useAIConfig, useAnalyticsStats } from '../lib/hooks';
import { ANALYSIS_STEPS, AI_MODELS } from '../lib/types-and-constants';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export function HomePage() {
  const { analysisHistory, setAnalysisHistory } = useLocalStorage();
  const { config } = useAIConfig();
  const { 
    currentAnalysis, 
    setCurrentAnalysis, 
    isAnalyzing, 
    analysisProgress, 
    currentStep, 
    analysisError,
    handleAnalysis,
    retryAnalysis
  } = useAnalysis({ setAnalysisHistory });
  const stats = useAnalyticsStats(analysisHistory);
  
  const [activeTab, setActiveTab] = useState('analyze');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);

  const handleExportResults = () => setShowExportDialog(true);
  const handleOpenAISettings = () => setShowAISettings(true);

  const selectedModel = AI_MODELS[config.selectedModel as keyof typeof AI_MODELS];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4"
    >
      <motion.div variants={itemVariants}>
        <HeroSection />
      </motion.div>

      {/* AI Status Bar */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI Model:</span>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  {selectedModel?.name || 'Not configured'}
                </Badge>
              </div>
              
              {stats.totalAnalyses > 0 && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Avg Confidence: {(stats.averageAIConfidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>Analyses: {stats.totalAnalyses}</span>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenAISettings}
              className="gap-2"
            >
              <Brain className="w-3 h-3" />
              AI Settings
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {stats.totalAnalyses > 0 && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatsOverview 
              totalAnalyses={stats.totalAnalyses}
              averageCredibility={stats.averageCredibility}
              analysisHistory={analysisHistory}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyze" className="relative">
              AI Analysis
              {isAnalyzing && (
                <motion.div
                  key="analyzing-indicator"
                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="relative">
              Analysis History
              {stats.totalAnalyses > 0 && (
                <motion.span
                  key="history-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {stats.totalAnalyses > 99 ? '99+' : stats.totalAnalyses}
                </motion.span>
              )}
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === 'analyze' && (
              <TabsContent value="analyze" className="space-y-6">
                <motion.div
                  key="analyze-content"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArticleInput onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
                  
                  {/* Analysis Error Display */}
                  <AnimatePresence>
                    {analysisError && (
                      <motion.div
                        key="analysis-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-destructive">Analysis Failed</h4>
                            <p className="text-sm text-destructive/80">{analysisError}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={retryAnalysis}>
                              Retry
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleOpenAISettings}>
                              Settings
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div
                        key="analysis-progress"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <AnalysisProgress 
                          progress={analysisProgress} 
                          currentStep={currentStep}
                          steps={ANALYSIS_STEPS}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {currentAnalysis && !isAnalyzing && (
                      <motion.div
                        key={`analysis-result-${currentAnalysis.id}`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <AnalysisResults analysis={currentAnalysis} />
                        
                        {/* AI-specific result details */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="mt-4 p-4 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <span className="text-muted-foreground">
                                Analyzed by {currentAnalysis.modelUsed}
                              </span>
                              <Badge variant="secondary">
                                {(currentAnalysis.aiConfidence * 100).toFixed(1)}% confidence
                              </Badge>
                            </div>
                            <span className="text-muted-foreground">
                              Processed in {(currentAnalysis.processingTime / 1000).toFixed(1)}s
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </TabsContent>
            )}

            {activeTab === 'history' && (
              <TabsContent value="history">
                <motion.div
                  key="history-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnalysisHistory 
                    analyses={analysisHistory} 
                    onSelectAnalysis={(analysis) => {
                      setCurrentAnalysis(analysis);
                      setActiveTab('analyze');
                    }}
                    onExport={stats.totalAnalyses > 0 ? handleExportResults : undefined}
                  />
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </motion.div>

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        analyses={analysisHistory}
        currentAnalysis={currentAnalysis || undefined}
      />

      <AISettings
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </motion.div>
  );
}