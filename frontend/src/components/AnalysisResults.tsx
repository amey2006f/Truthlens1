import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Minus, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { AnalysisResult } from '../lib/types-and-constants';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

interface AnimatedProgressProps {
  value: number;
  className?: string;
  color?: 'default' | 'green' | 'yellow' | 'red';
}

function AnimatedProgress({ value, className, color = 'default' }: AnimatedProgressProps) {
  const colorClasses = {
    default: '',
    green: '[&>div]:bg-green-500',
    yellow: '[&>div]:bg-yellow-500',
    red: '[&>div]:bg-red-500'
  };

  return (
    <div className={`relative ${className}`}>
      <Progress value={0} className={`h-2 ${colorClasses[color]}`} />
      <motion.div
        className="absolute top-0 left-0 h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}

interface CountUpProps {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

function CountUp({ end, suffix = '', decimals = 0, duration = 1 }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(end * easeOutQuart);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    factors: true,
    findings: true
  });
  const [showAllFindings, setShowAllFindings] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCredibilityIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 40) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number): 'green' | 'yellow' | 'red' => {
    if (score >= 70) return 'green';
    if (score >= 40) return 'yellow';
    return 'red';
  };

  const getBiasIcon = () => {
    if (analysis.biasDirection === 'left') return <TrendingDown className="h-4 w-4 text-blue-500" />;
    if (analysis.biasDirection === 'right') return <TrendingUp className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const credibilityScore = 100 - analysis.fakeNewsScore;
  const displayedFindings = showAllFindings ? analysis.keyFindings : analysis.keyFindings.slice(0, 3);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Overall Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleSection('details')}
            >
              <motion.div
                animate={{ rotate: expandedSections.details ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
              {getCredibilityIcon(credibilityScore)}
              Overall Assessment
            </CardTitle>
            <CardDescription>
              Analysis completed on {analysis.timestamp.toLocaleString()}
            </CardDescription>
          </CardHeader>
          
          <AnimatePresence>
            {expandedSections.details && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="flex justify-between items-center">
                        <span>Credibility Score</span>
                        <span className={`font-medium ${getCredibilityColor(credibilityScore)}`}>
                          <CountUp end={credibilityScore} suffix="%" decimals={0} />
                        </span>
                      </div>
                      <AnimatedProgress 
                        value={credibilityScore} 
                        color={getProgressColor(credibilityScore)} 
                      />
                      
                      {/* Credibility Indicator */}
                      <motion.div
                        className={`text-xs px-2 py-1 rounded-full inline-block ${
                          credibilityScore >= 70 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : credibilityScore >= 40 
                            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        {credibilityScore >= 70 ? 'High Credibility' : 
                         credibilityScore >= 40 ? 'Moderate Credibility' : 'Low Credibility'}
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="flex justify-between items-center">
                        <span>Bias Level</span>
                        <div className="flex items-center gap-2">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            {getBiasIcon()}
                          </motion.div>
                          <span>
                            <CountUp end={Math.abs(analysis.biasScore)} suffix="%" decimals={0} />
                          </span>
                          <Badge variant={analysis.biasDirection === 'center' ? 'secondary' : 'outline'}>
                            {analysis.biasDirection}
                          </Badge>
                        </div>
                      </div>
                      <AnimatedProgress value={Math.abs(analysis.biasScore)} />
                    </motion.div>
                  </div>

                  <motion.div 
                    className="pt-4 border-t border-border/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <h4 className="mb-3 flex items-center gap-2">
                      Article Information
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                      >
                        📰
                      </motion.div>
                    </h4>
                    <div className="text-sm space-y-2">
                      <p><strong>Title:</strong> {analysis.title}</p>
                      {analysis.url && (
                        <p>
                          <strong>Source:</strong>{' '}
                          <motion.a
                            href={analysis.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.1 }}
                          >
                            {new URL(analysis.url).hostname}
                          </motion.a>
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <strong>Sentiment:</strong> 
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
                      </p>
                    </div>
                  </motion.div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Detailed Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleSection('factors')}
            >
              <motion.div
                animate={{ rotate: expandedSections.factors ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
              Credibility Factors
            </CardTitle>
            <CardDescription>
              Breakdown of factors contributing to the overall credibility assessment
            </CardDescription>
          </CardHeader>
          
          <AnimatePresence>
            {expandedSections.factors && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="space-y-4">
                  {Object.entries(analysis.credibilityFactors).map(([factor, score], index) => (
                    <motion.div 
                      key={`factor-${factor}`}
                      className="space-y-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-medium">
                          {factor.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                        <span className={`font-medium ${getCredibilityColor(score)}`}>
                          <CountUp end={score} suffix="%" decimals={0} duration={1.2} />
                        </span>
                      </div>
                      <AnimatedProgress 
                        value={score} 
                        color={getProgressColor(score)}
                      />
                    </motion.div>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Key Findings */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleSection('findings')}
            >
              <motion.div
                animate={{ rotate: expandedSections.findings ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
              Key Findings
              <Badge variant="outline" className="ml-2">
                {analysis.keyFindings.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Important observations from the AI analysis
            </CardDescription>
          </CardHeader>
          
          <AnimatePresence>
            {expandedSections.findings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {displayedFindings.map((finding, index) => (
                      <motion.li
                        key={`finding-${index}-${finding.slice(0, 10)}`}
                        className="flex items-start gap-3 text-sm p-3 rounded-lg hover:bg-muted/30 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        layout
                      >
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                        />
                        <span>{finding}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  
                  {analysis.keyFindings.length > 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="pt-2"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAllFindings(!showAllFindings)}
                        className="w-full"
                      >
                        {showAllFindings ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Show All {analysis.keyFindings.length} Findings
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  );
}