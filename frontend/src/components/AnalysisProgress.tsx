import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Brain, CheckCircle, Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
  currentStep: string;
  steps: string[];
}

export function AnalysisProgress({ progress, currentStep, steps }: AnalysisProgressProps) {
  const currentStepIndex = steps.findIndex(step => step === currentStep);

  return (
    <Card className="mt-6 bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Brain className="h-6 w-6 text-primary" />
          </motion.div>
          <span>AI Analysis in Progress</span>
          <motion.span 
            className="text-sm text-muted-foreground ml-auto"
            key={progress}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {progress.toFixed(0)}%
          </motion.span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <motion.p 
            className="text-sm text-primary font-medium"
            key={currentStep}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep}
          </motion.p>
        </div>

        {/* Step Indicators */}
        <div className="grid gap-3">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <motion.div
                key={step}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isCompleted ? 'bg-green-50 dark:bg-green-950/20' :
                  isCurrent ? 'bg-blue-50 dark:bg-blue-950/20' :
                  'bg-muted/30'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Step Icon */}
                <div className={`flex-shrink-0 ${
                  isCompleted ? 'text-green-600' :
                  isCurrent ? 'text-blue-600' :
                  'text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>

                {/* Step Text */}
                <span className={`text-sm ${
                  isCompleted ? 'text-green-700 dark:text-green-300' :
                  isCurrent ? 'text-blue-700 dark:text-blue-300 font-medium' :
                  'text-muted-foreground'
                }`}>
                  {step}
                </span>

                {/* Progress Animation for Current Step */}
                {isCurrent && (
                  <motion.div
                    className="ml-auto w-12 h-1 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      animate={{ x: [-48, 48] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Processing Animation */}
        <div className="flex justify-center pt-4">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}