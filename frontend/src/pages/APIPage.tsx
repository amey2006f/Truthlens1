import { motion } from 'motion/react';
import { Code, Key, Book, Zap, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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

export function APIPage() {
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
            <Code className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">TruthLens API</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Integrate AI-powered fact-checking and bias detection into your applications with our 
          comprehensive REST API and developer tools.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button size="lg" className="gap-2">
            <Key className="w-4 h-4" />
            Get API Key
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Book className="w-4 h-4" />
            View Docs
          </Button>
        </div>
      </motion.div>

      {/* Quick Start */}
      <motion.div variants={itemVariants} className="mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Get up and running with TruthLens API in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">1. Get Your API Key</h4>
                <p className="text-sm text-muted-foreground">
                  Sign up for a free developer account to receive your API key
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">2. Make Your First Request</h4>
                <div className="bg-black text-green-400 rounded p-3 text-sm font-mono overflow-x-auto">
                  {`curl -X POST https://api.truthlens.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/article"}'`}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">3. Process Results</h4>
                <p className="text-sm text-muted-foreground">
                  Receive detailed analysis including credibility scores, bias detection, and fact-checking results
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Features */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">API Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-primary" />
                Article Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Comprehensive analysis of news articles and web content for credibility and bias.
              </p>
              <div className="space-y-2">
                <Badge variant="secondary">Credibility Scoring</Badge>
                <Badge variant="secondary">Bias Detection</Badge>
                <Badge variant="secondary">Fact Verification</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="w-5 h-5 text-primary" />
                Batch Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Process multiple articles simultaneously for large-scale content analysis.
              </p>
              <div className="space-y-2">
                <Badge variant="secondary">Bulk Analysis</Badge>
                <Badge variant="secondary">Async Processing</Badge>
                <Badge variant="secondary">Result Webhooks</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-primary" />
                Real-time Streaming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Stream analysis results in real-time for live content monitoring.
              </p>
              <div className="space-y-2">
                <Badge variant="secondary">WebSocket Support</Badge>
                <Badge variant="secondary">Live Updates</Badge>
                <Badge variant="secondary">Event Streaming</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* API Documentation */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">API Documentation</h2>
        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="batch">Batch</TabsTrigger>
            <TabsTrigger value="stream">Stream</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  POST /v1/analyze
                </CardTitle>
                <CardDescription>
                  Analyze a single article for credibility, bias, and factual accuracy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Request Body</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto">
{`{
  "url": "https://example.com/article",
  "text": "Article content...", // Optional, use instead of URL
  "options": {
    "depth": "standard", // quick, standard, comprehensive
    "focus": ["bias", "factuality", "sentiment"],
    "model": "gpt-4-turbo"
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Response</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto">
{`{
  "id": "analysis_123",
  "status": "completed",
  "results": {
    "credibility_score": 85.2,
    "fake_news_probability": 14.8,
    "bias_score": -12.3,
    "bias_direction": "left",
    "confidence": 0.92,
    "processing_time_ms": 2340,
    "model_used": "gpt-4-turbo"
  },
  "details": {
    "key_findings": [...],
    "fact_checks": [...],
    "bias_indicators": [...],
    "source_analysis": {...}
  }
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  POST /v1/batch/analyze
                </CardTitle>
                <CardDescription>
                  Submit multiple articles for batch analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Request Body</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto">
{`{
  "articles": [
    {
      "id": "article_1",
      "url": "https://example.com/article1"
    },
    {
      "id": "article_2", 
      "text": "Article content..."
    }
  ],
  "webhook_url": "https://your-app.com/webhook",
  "options": {
    "depth": "standard",
    "model": "gpt-4-turbo"
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Response</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto">
{`{
  "batch_id": "batch_456",
  "status": "processing",
  "total_articles": 2,
  "estimated_completion": "2024-01-15T10:30:00Z",
  "webhook_url": "https://your-app.com/webhook"
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stream" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  WebSocket /v1/stream
                </CardTitle>
                <CardDescription>
                  Real-time streaming analysis for live content monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Connection</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto">
{`const ws = new WebSocket('wss://api.truthlens.ai/v1/stream');
ws.onopen = () => {
  ws.send(JSON.stringify({
    "type": "auth",
    "token": "YOUR_API_KEY"
  }));
};`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Send Analysis Request</h4>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto">
{`ws.send(JSON.stringify({
  "type": "analyze",
  "data": {
    "url": "https://example.com/article",
    "options": {
      "depth": "standard"
    }
  }
}));`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Available Models
                </CardTitle>
                <CardDescription>
                  Choose from different AI models optimized for specific analysis types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">GPT-4 Turbo</h4>
                        <Badge>Recommended</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Best overall performance for comprehensive analysis
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">High Accuracy</Badge>
                        <Badge variant="outline" className="text-xs">Detailed Analysis</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Claude 3 Sonnet</h4>
                        <Badge variant="secondary">Bias Expert</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Specialized in bias detection and careful analysis
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">Bias Detection</Badge>
                        <Badge variant="outline" className="text-xs">Conservative</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Gemini Pro</h4>
                        <Badge variant="secondary">Fast</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Quick analysis with good fact-checking capabilities
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">Fast Processing</Badge>
                        <Badge variant="outline" className="text-xs">Fact Checking</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Custom Models</h4>
                        <Badge variant="secondary">Enterprise</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Fine-tuned models for specific domains or use cases
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">Specialized</Badge>
                        <Badge variant="outline" className="text-xs">Custom Training</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Pricing & Limits */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold text-center mb-8">Pricing & Limits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Free Tier</CardTitle>
              <CardDescription>Perfect for testing and small projects</CardDescription>
              <div className="text-3xl font-bold mt-4">$0</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">API Calls</span>
                  <span className="text-sm font-medium">1,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rate Limit</span>
                  <span className="text-sm font-medium">10/minute</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Analysis Depth</span>
                  <span className="text-sm font-medium">Standard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Support</span>
                  <span className="text-sm font-medium">Community</span>
                </div>
              </div>
              <Separator />
              <Button className="w-full" variant="outline">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader className="text-center">
              <CardTitle>Pro</CardTitle>
              <CardDescription>For growing applications and businesses</CardDescription>
              <div className="text-3xl font-bold mt-4">$49<span className="text-sm font-normal">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">API Calls</span>
                  <span className="text-sm font-medium">50,000/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rate Limit</span>
                  <span className="text-sm font-medium">100/minute</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Analysis Depth</span>
                  <span className="text-sm font-medium">All levels</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Support</span>
                  <span className="text-sm font-medium">Email & Chat</span>
                </div>
              </div>
              <Separator />
              <Button className="w-full">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>Custom solutions for large organizations</CardDescription>
              <div className="text-3xl font-bold mt-4">Custom</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">API Calls</span>
                  <span className="text-sm font-medium">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rate Limit</span>
                  <span className="text-sm font-medium">Custom</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Models</span>
                  <span className="text-sm font-medium">Custom + All</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Support</span>
                  <span className="text-sm font-medium">Dedicated</span>
                </div>
              </div>
              <Separator />
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}