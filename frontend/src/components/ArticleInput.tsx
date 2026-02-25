import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Link, FileText, Zap, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { AnalysisInput } from '../lib/types-and-constants';
import { validateAnalysisInput, isValidUrl } from '../lib/utils-and-mock';

interface ArticleInputProps {
  onAnalyze: (input: AnalysisInput) => void;
  isAnalyzing: boolean;
}

export function ArticleInput({ onAnalyze, isAnalyzing }: ArticleInputProps) {
  const [activeTab, setActiveTab] = useState('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [urlError, setUrlError] = useState('');
  const [textError, setTextError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setUrlError('');
    setTextError('');

    const input: AnalysisInput = activeTab === 'url' ? { url: url.trim() } : { text: text.trim() };
    
    // Validate input
    const validation = validateAnalysisInput(input);
    if (!validation.isValid) {
      if (activeTab === 'url') {
        setUrlError(validation.error || 'Invalid URL');
      } else {
        setTextError(validation.error || 'Invalid text');
      }
      return;
    }

    onAnalyze(input);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (urlError && value.trim()) {
      setUrlError('');
    }
  };

  const handleTextChange = (value: string) => {
    setText(value);
    if (textError && value.trim()) {
      setTextError('');
    }
  };

  const exampleUrls = [
    'https://www.reuters.com/world/',
    'https://www.bbc.com/news',
    'https://www.npr.org/sections/news/',
    'https://apnews.com/'
  ];

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setUrlError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Analyze Article
          </CardTitle>
          <CardDescription>
            Submit a news article URL or paste article text for AI-powered analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url" className="gap-2">
                  <Link className="w-4 h-4" />
                  Article URL
                </TabsTrigger>
                <TabsTrigger value="text" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Direct Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="url-input" className="text-sm font-medium">
                    Article URL
                  </label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/news-article"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className={urlError ? 'border-destructive' : ''}
                  />
                  {urlError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{urlError}</AlertDescription>
                    </Alert>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter a valid HTTP or HTTPS URL to a news article
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Try these examples:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {exampleUrls.map((exampleUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleExampleClick(exampleUrl)}
                        className="p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors"
                        disabled={isAnalyzing}
                      >
                        <div className="text-sm font-medium truncate">{exampleUrl}</div>
                        <div className="text-xs text-muted-foreground">
                          {new URL(exampleUrl).hostname}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="text-input" className="text-sm font-medium">
                    Article Text
                  </label>
                  <Textarea
                    id="text-input"
                    placeholder="Paste the full article text here..."
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className={`min-h-[200px] ${textError ? 'border-destructive' : ''}`}
                  />
                  {textError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{textError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minimum 50 characters required</span>
                    <span>{text.length}/50,000 characters</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Zap className="w-3 h-3" />
                  AI-Powered
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Analysis typically takes 2-5 seconds
                </span>
              </div>
              
              <Button
                type="submit"
                disabled={
                  isAnalyzing || 
                  (activeTab === 'url' && (!url.trim() || !isValidUrl(url.trim()))) ||
                  (activeTab === 'text' && (!text.trim() || text.trim().length < 50))
                }
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Analyze Article
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}