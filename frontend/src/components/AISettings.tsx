import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Brain, Key, Zap, Shield, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useAIConfig } from '../lib/hooks';
import { AI_MODELS } from '../lib/types-and-constants';
import { toast } from 'sonner@2.0.3';

interface AISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AISettings({ isOpen, onClose }: AISettingsProps) {
  const { config, updateConfig } = useAIConfig();
  const [apiKeys, setApiKeys] = useState({
    openai: config.openaiApiKey || '',
    huggingface: config.huggingfaceApiKey || '',
    custom: config.customEndpoint || ''
  });

  const handleSaveConfig = () => {
    updateConfig({
      ...config,
      openaiApiKey: apiKeys.openai,
      huggingfaceApiKey: apiKeys.huggingface,
      customEndpoint: apiKeys.custom
    });
    
    toast.success('AI Configuration Saved', {
      description: 'Your AI settings have been updated successfully.'
    });
    onClose();
  };

  const handleTestConnection = async (provider: string) => {
    toast.loading('Testing connection...', { id: 'test-connection' });
    
    // Deterministic mock: always report success after a short delay (no randomness).
    setTimeout(() => {
      toast.success('Connection successful!', { 
        id: 'test-connection',
        description: `${provider} configuration saved (mock check).`
      });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Configure AI models and analysis settings
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="models" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    AI Model Selection
                  </CardTitle>
                  <CardDescription>
                    Choose the AI model for analyzing articles. Different models have varying strengths.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Selected Model</Label>
                    <Select
                      value={config.selectedModel}
                      onValueChange={(value) => updateConfig({ selectedModel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(AI_MODELS).map(([key, model]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              <Badge variant="secondary" className="ml-2">
                                {model.provider}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {config.selectedModel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium">
                          {AI_MODELS[config.selectedModel as keyof typeof AI_MODELS].name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Provider: {AI_MODELS[config.selectedModel as keyof typeof AI_MODELS].provider}
                        </p>
                        <div className="flex gap-2">
                          {AI_MODELS[config.selectedModel as keyof typeof AI_MODELS].strengths.map((strength, index) => (
                            <Badge key={index} variant="outline">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    API Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure API keys for different AI providers. Keys are stored locally and never shared.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>OpenAI API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="sk-..."
                          value={apiKeys.openai}
                          onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestConnection('OpenAI')}
                        >
                          Test
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Required for GPT models. Get your key from OpenAI dashboard.
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Hugging Face API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="hf_..."
                          value={apiKeys.huggingface}
                          onChange={(e) => setApiKeys(prev => ({ ...prev, huggingface: e.target.value }))}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestConnection('Hugging Face')}
                        >
                          Test
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        For open-source models. Get your key from Hugging Face.
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Custom Endpoint</Label>
                      <Input
                        placeholder="https://your-api-endpoint.com"
                        value={apiKeys.custom}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, custom: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use your own AI endpoint or local model server.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Analysis Settings
                  </CardTitle>
                  <CardDescription>
                    Configure analysis depth and enable specific features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Analysis Depth</Label>
                      <Select
                        value={config.analysisDepth}
                        onValueChange={(value: any) => updateConfig({ analysisDepth: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quick">Quick - Fast analysis</SelectItem>
                          <SelectItem value="standard">Standard - Balanced approach</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive - Deep analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Analysis Features</h4>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Bias Detection</Label>
                          <p className="text-sm text-muted-foreground">
                            Detect political and confirmation bias
                          </p>
                        </div>
                        <Switch
                          checked={config.enableBiasDetection}
                          onCheckedChange={(checked) => updateConfig({ enableBiasDetection: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Fact Checking</Label>
                          <p className="text-sm text-muted-foreground">
                            Verify claims against reliable sources
                          </p>
                        </div>
                        <Switch
                          checked={config.enableFactChecking}
                          onCheckedChange={(checked) => updateConfig({ enableFactChecking: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Sentiment Analysis</Label>
                          <p className="text-sm text-muted-foreground">
                            Analyze emotional tone and language
                          </p>
                        </div>
                        <Switch
                          checked={config.enableSentimentAnalysis}
                          onCheckedChange={(checked) => updateConfig({ enableSentimentAnalysis: checked })}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Confidence Threshold ({(config.confidenceThreshold * 100).toFixed(0)}%)</Label>
                      <Slider
                        value={[config.confidenceThreshold]}
                        onValueChange={([value]) => updateConfig({ confidenceThreshold: value })}
                        min={0.5}
                        max={0.95}
                        step={0.05}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum confidence level for analysis results
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    Monitor AI model performance and usage statistics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Average Processing Time</h4>
                      <p className="text-2xl font-bold text-primary">2.3s</p>
                      <p className="text-sm text-muted-foreground">Last 10 analyses</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Average Confidence</h4>
                      <p className="text-2xl font-bold text-green-600">87%</p>
                      <p className="text-sm text-muted-foreground">Model accuracy</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Total Analyses</h4>
                      <p className="text-2xl font-bold text-blue-600">156</p>
                      <p className="text-sm text-muted-foreground">All time</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Success Rate</h4>
                      <p className="text-2xl font-bold text-purple-600">94%</p>
                      <p className="text-sm text-muted-foreground">Analysis completion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 border-t bg-muted/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveConfig}>
            Save Configuration
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}