import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, BarChart3, Users } from 'lucide-react';
import { AnalysisResult } from '../App';

interface StatsOverviewProps {
  totalAnalyses: number;
  averageCredibility: number;
  analysisHistory: AnalysisResult[];
}

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

function AnimatedCounter({ end, duration = 1, suffix = '', decimals = 0 }: AnimatedCounterProps) {
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

  return (
    <span>
      {count.toFixed(decimals)}{suffix}
    </span>
  );
}

export function StatsOverview({ totalAnalyses, averageCredibility, analysisHistory }: StatsOverviewProps) {
  const recentAnalyses = analysisHistory.slice(0, 5);
  const highCredibilityCount = analysisHistory.filter(a => (100 - a.fakeNewsScore) > 70).length;
  const lowCredibilityCount = analysisHistory.filter(a => (100 - a.fakeNewsScore) < 40).length;
  
  const biasDistribution = {
    left: analysisHistory.filter(a => a.biasDirection === 'left').length,
    center: analysisHistory.filter(a => a.biasDirection === 'center').length,
    right: analysisHistory.filter(a => a.biasDirection === 'right').length,
  };

  const stats = [
    {
      icon: BarChart3,
      title: 'Total Analyses',
      value: totalAnalyses,
      suffix: '',
      change: '+12%',
      trend: 'up',
      color: 'blue',
    },
    {
      icon: Shield,
      title: 'Avg. Credibility',
      value: averageCredibility,
      suffix: '%',
      change: '+5.2%',
      trend: 'up',
      color: 'green',
      decimals: 1,
    },
    {
      icon: Users,
      title: 'High Quality',
      value: highCredibilityCount,
      suffix: '',
      change: `${((highCredibilityCount / totalAnalyses) * 100).toFixed(0)}%`,
      trend: 'up',
      color: 'emerald',
    },
    {
      icon: AlertTriangle,
      title: 'Low Quality',
      value: lowCredibilityCount,
      suffix: '',
      change: `${((lowCredibilityCount / totalAnalyses) * 100).toFixed(0)}%`,
      trend: 'down',
      color: 'red',
    },
  ];

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="mb-2">Analytics Overview</h2>
        <p className="text-muted-foreground">
          Real-time insights from your analysis history
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/20 transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br opacity-5 ${
                  stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  stat.color === 'green' ? 'from-green-500 to-green-600' :
                  stat.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                  'from-red-500 to-red-600'
                }`} />
                
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className={`p-2 rounded-xl ${
                        stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                        stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/20' :
                        'bg-red-100 dark:bg-red-900/20'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={`h-5 w-5 ${
                        stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                        'text-red-600 dark:text-red-400'
                      }`} />
                    </motion.div>
                    
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      isPositive 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">
                      <AnimatedCounter 
                        end={stat.value} 
                        suffix={stat.suffix}
                        decimals={stat.decimals || 0}
                      />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bias Distribution */}
      {totalAnalyses > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Bias Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(biasDistribution).map(([bias, count], index) => {
                  const percentage = (count / totalAnalyses) * 100;
                  const colors = {
                    left: 'bg-blue-500',
                    center: 'bg-gray-500',
                    right: 'bg-red-500'
                  };

                  return (
                    <div key={bias} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="capitalize font-medium">{bias} Leaning</span>
                        <span className="text-muted-foreground">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full ${colors[bias as keyof typeof colors]} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAnalyses.map((analysis, index) => {
                  const credibility = 100 - analysis.fakeNewsScore;
                  
                  return (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        credibility > 70 ? 'bg-green-500' :
                        credibility > 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {analysis.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {analysis.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {credibility.toFixed(0)}%
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}