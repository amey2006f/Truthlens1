import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ExternalLink, AlertTriangle, CheckCircle, AlertCircle, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AdvancedSearch } from './AdvancedSearch';
import { AnalysisResult } from '../App';

interface AnalysisHistoryProps {
  analyses: AnalysisResult[];
  onSelectAnalysis: (analysis: AnalysisResult) => void;
  onExport?: () => void;
}

export function AnalysisHistory({ analyses, onSelectAnalysis, onExport }: AnalysisHistoryProps) {
  const [filteredAnalyses, setFilteredAnalyses] = useState<AnalysisResult[]>(analyses);
  const [showSearch, setShowSearch] = useState(false);

  const getCredibilityIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (score >= 40) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const getCredibilityLabel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const handleFilter = (filtered: AnalysisResult[]) => {
    setFilteredAnalyses(filtered);
  };

  // Update filtered analyses when the main analyses change
  useState(() => {
    setFilteredAnalyses(analyses);
  });

  if (analyses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            </motion.div>
            <h3>No Analysis History</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Your analyzed articles will appear here. Start by analyzing an article in the "Analyze Article" tab to build your history.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Analysis History
                  <Badge variant="secondary" className="ml-2">
                    {filteredAnalyses.length} of {analyses.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  View and revisit your previously analyzed articles
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showSearch ? 'Hide' : 'Show'} Filters
                </Button>
                
                {onExport && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Advanced Search */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdvancedSearch analyses={analyses} onFilter={handleFilter} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {filteredAnalyses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Filter className="h-8 w-8 text-muted-foreground mb-2" />
              <h3>No Results Found</h3>
              <p className="text-muted-foreground text-center">
                No analyses match your current filters. Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAnalyses.map((analysis, index) => {
              const credibilityScore = 100 - analysis.fakeNewsScore;
              
              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <Card className="hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <motion.h4 
                              className="line-clamp-2 group-hover:text-primary transition-colors"
                              whileHover={{ x: 2 }}
                            >
                              {analysis.title}
                            </motion.h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {analysis.timestamp.toLocaleDateString()} at {analysis.timestamp.toLocaleTimeString()}
                            </p>
                            {analysis.url && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {new URL(analysis.url).hostname}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <motion.div 
                              className="flex items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                            >
                              {getCredibilityIcon(credibilityScore)}
                              <span className="text-sm font-medium">
                                {getCredibilityLabel(credibilityScore)} Credibility
                              </span>
                            </motion.div>
                            <div className="flex gap-2">
                              <Badge variant={analysis.biasDirection === 'center' ? 'secondary' : 'outline'}>
                                {analysis.biasDirection} bias
                              </Badge>
                              <Badge 
                                variant="outline"
                                className={
                                  analysis.sentiment === 'positive' ? 'border-green-500 text-green-700' :
                                  analysis.sentiment === 'negative' ? 'border-red-500 text-red-700' :
                                  'border-gray-500 text-gray-700'
                                }
                              >
                                {analysis.sentiment}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>Credibility: {credibilityScore.toFixed(0)}%</span>
                          <span>•</span>
                          <span>Bias: {Math.abs(analysis.biasScore).toFixed(0)}%</span>
                          <span>•</span>
                          <span>{analysis.keyFindings.length} findings</span>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-2 border-t border-border/50">
                          <div className="text-xs text-muted-foreground">
                            Click to view detailed analysis
                          </div>
                          
                          <div className="flex gap-2">
                            {analysis.url && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button variant="outline" size="sm" asChild>
                                  <a 
                                    href={analysis.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Source
                                  </a>
                                </Button>
                              </motion.div>
                            )}
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                size="sm"
                                onClick={() => onSelectAnalysis(analysis)}
                                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                              >
                                View Analysis
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}