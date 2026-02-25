import { motion } from 'motion/react';
import { Shield, Brain, Target, Users, Award, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

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

export function AboutPage() {
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">About TruthLens</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          TruthLens is an AI-powered platform dedicated to combating misinformation and promoting media literacy 
          through advanced bias detection and credibility analysis.
        </p>
      </motion.div>

      {/* Mission Statement */}
      <motion.div variants={itemVariants} className="mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Target className="w-6 h-6" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-center leading-relaxed">
              In an era of information overload and digital misinformation, TruthLens empowers users with 
              AI-driven tools to evaluate news articles, detect bias, and make informed decisions about the 
              content they consume and share.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Features */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI-Powered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced machine learning models analyze articles for credibility, bias, and factual accuracy 
                with high precision and confidence scores.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Bias Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Identify political bias, confirmation bias, framing effects, and other forms of editorial 
                slant that may influence reader perception.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Fact Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cross-reference claims with reliable sources and databases to verify factual accuracy 
                and identify potential misinformation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Source Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Evaluate source credibility, domain authority, historical reliability, and editorial 
                standards to assess overall trustworthiness.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Linguistic Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analyze writing style, emotional language, sensationalism, and other linguistic patterns 
                that may indicate bias or manipulation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Multi-Model Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Choose from multiple AI models including GPT-4, Claude, and Gemini, each optimized 
                for different aspects of content analysis.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Technology Stack */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Technology</h2>
        <Card>
          <CardHeader>
            <CardTitle>Powered by Advanced AI</CardTitle>
            <CardDescription>
              TruthLens leverages cutting-edge artificial intelligence and machine learning technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">AI Models</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">GPT-4 Turbo</Badge>
                  <Badge variant="secondary">Claude 3 Sonnet</Badge>
                  <Badge variant="secondary">Gemini Pro</Badge>
                  <Badge variant="secondary">Custom Models</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Multiple state-of-the-art language models for comprehensive analysis and cross-validation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Analysis Techniques</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">Natural Language Processing</Badge>
                  <Badge variant="outline">Sentiment Analysis</Badge>
                  <Badge variant="outline">Bias Detection</Badge>
                  <Badge variant="outline">Fact Verification</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Advanced NLP techniques for deep understanding and analysis of textual content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team & Values */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We provide clear explanations of our analysis methods and confidence scores, 
                ensuring users understand how results are generated.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced AI analysis should be available to everyone. We make powerful tools 
                accessible to users regardless of technical expertise.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We continuously improve our models and validation processes to ensure the highest 
                possible accuracy in bias detection and credibility assessment.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div variants={itemVariants}>
        <Card className="bg-muted/50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Your privacy and data security are our top priorities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Data Privacy</h4>
                <p className="text-sm text-muted-foreground">
                  TruthLens processes articles for analysis but does not store personal information or 
                  browsing history. All analysis data is kept locally in your browser.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">API Security</h4>
                <p className="text-sm text-muted-foreground">
                  API keys and configuration data are stored locally and never transmitted to our servers. 
                  All AI model communications use secure, encrypted connections.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}