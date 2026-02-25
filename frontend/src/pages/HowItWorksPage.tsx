import { motion } from 'motion/react';
import { ArrowRight, Brain, Search, Target, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

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

export function HowItWorksPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">How TruthLens Works</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover the advanced AI technology and methodology behind TruthLens' comprehensive 
          article analysis and bias detection system.
        </p>
      </motion.div>

      {/* Analysis Process */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Analysis Process</h2>
        <div className="space-y-8">
          {/* Step 1 */}
          <Card className="relative">
            <div className="absolute -left-4 top-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              1
            </div>
            <CardHeader className="pl-8">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Content Extraction & Preprocessing
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-8">
              <p className="text-muted-foreground mb-4">
                TruthLens extracts article content from URLs or processes directly submitted text. 
                The system then cleans and preprocesses the content for analysis.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">URL Processing</h4>
                  <p className="text-xs text-muted-foreground">Extract article content from web pages</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">Text Cleaning</h4>
                  <p className="text-xs text-muted-foreground">Remove ads, navigation, and formatting</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">Content Validation</h4>
                  <p className="text-xs text-muted-foreground">Ensure sufficient content for analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          {/* Step 2 */}
          <Card className="relative">
            <div className="absolute -left-4 top-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              2
            </div>
            <CardHeader className="pl-8">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Model Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-8">
              <p className="text-muted-foreground mb-4">
                Multiple AI models simultaneously analyze different aspects of the article using 
                advanced natural language processing techniques.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Parallel Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Bias Detection</Badge>
                      <span className="text-sm text-muted-foreground">Political & confirmation bias</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Fact Checking</Badge>
                      <span className="text-sm text-muted-foreground">Claim verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Sentiment Analysis</Badge>
                      <span className="text-sm text-muted-foreground">Emotional tone detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Linguistic Analysis</Badge>
                      <span className="text-sm text-muted-foreground">Writing style patterns</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">AI Models</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">GPT-4</Badge>
                      <span className="text-sm text-muted-foreground">Comprehensive analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Claude 3</Badge>
                      <span className="text-sm text-muted-foreground">Bias detection specialist</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Gemini Pro</Badge>
                      <span className="text-sm text-muted-foreground">Fact-checking focus</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          {/* Step 3 */}
          <Card className="relative">
            <div className="absolute -left-4 top-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              3
            </div>
            <CardHeader className="pl-8">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Source & Credibility Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-8">
              <p className="text-muted-foreground mb-4">
                The system evaluates the source's historical reliability, domain authority, and 
                editorial standards to provide comprehensive credibility metrics.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <h4 className="font-medium text-sm">Domain Authority</h4>
                  <p className="text-xs text-muted-foreground">Website reputation score</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <h4 className="font-medium text-sm">Historical Data</h4>
                  <p className="text-xs text-muted-foreground">Past accuracy record</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <h4 className="font-medium text-sm">Editorial Standards</h4>
                  <p className="text-xs text-muted-foreground">Publication practices</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <h4 className="font-medium text-sm">Expert Relevance</h4>
                  <p className="text-xs text-muted-foreground">Topic expertise level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          {/* Step 4 */}
          <Card className="relative">
            <div className="absolute -left-4 top-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              4
            </div>
            <CardHeader className="pl-8">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Score Calculation & Results
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-8">
              <p className="text-muted-foreground mb-4">
                All analysis components are weighted and combined to produce final credibility, 
                bias, and confidence scores with detailed explanations.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Score Components</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Factual Accuracy</span>
                      <Badge variant="outline">50%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Bias Detection</span>
                      <Badge variant="outline">30%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Source Reliability</span>
                      <Badge variant="outline">20%</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Output Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Credibility Score (0-100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Bias Direction & Intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">AI Confidence Level</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Analysis Types */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Types of Analysis</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                Bias Detection
              </CardTitle>
              <CardDescription>
                Identifying various forms of editorial bias and political leaning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Types Detected</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• Political bias</div>
                  <div>• Confirmation bias</div>
                  <div>• Selection bias</div>
                  <div>• Framing effects</div>
                  <div>• Attribution bias</div>
                  <div>• Omission bias</div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Detection Methods</h4>
                <p className="text-sm text-muted-foreground">
                  Analysis of language patterns, source selection, fact presentation, 
                  and emotional appeals to identify biased reporting.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Fact Verification
              </CardTitle>
              <CardDescription>
                Cross-referencing claims with reliable sources and databases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Verification Process</h4>
                <div className="space-y-1 text-sm">
                  <div>• Claim extraction and categorization</div>
                  <div>• Source attribution analysis</div>
                  <div>• Cross-reference with fact-checkers</div>
                  <div>• Statistical claim validation</div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Results</h4>
                <p className="text-sm text-muted-foreground">
                  Each claim is marked as verified, disputed, false, or unverified 
                  with supporting evidence and confidence scores.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Confidence & Accuracy */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Confidence & Accuracy
            </CardTitle>
            <CardDescription>
              Understanding TruthLens confidence scores and accuracy metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">85%</span>
                </div>
                <h4 className="font-medium mb-2">Average Accuracy</h4>
                <p className="text-sm text-muted-foreground">
                  Overall accuracy rate across all analysis types based on validation studies
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">92%</span>
                </div>
                <h4 className="font-medium mb-2">High Confidence Rate</h4>
                <p className="text-sm text-muted-foreground">
                  Percentage of analyses with confidence scores above 80%
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2.3s</span>
                </div>
                <h4 className="font-medium mb-2">Average Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Typical time required for comprehensive article analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}