import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, Code, X, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { AnalysisResult } from '../lib/types-and-constants';
import { generateCSVData, generateJSONData, downloadFile, generateExportFilename } from '../lib/utils-and-mock';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analyses: AnalysisResult[];
  currentAnalysis?: AnalysisResult;
}

export function ExportDialog({ isOpen, onClose, analyses, currentAnalysis }: ExportDialogProps) {
  const [exportType, setExportType] = useState<'current' | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);

  const dataToExport = exportType === 'current' && currentAnalysis ? [currentAnalysis] : analyses;
  const exportCount = dataToExport.length;

  const handleExport = async (format: 'csv' | 'json') => {
    if (exportCount === 0) {
      toast.error('No data to export', {
        description: 'Please analyze some articles first.'
      });
      return;
    }

    setIsExporting(true);
    
    try {
      let content: string;
      let mimeType: string;
      
      if (format === 'csv') {
        content = generateCSVData(dataToExport);
        mimeType = 'text/csv;charset=utf-8;';
      } else {
        content = generateJSONData(dataToExport);
        mimeType = 'application/json;charset=utf-8;';
      }
      
      const filename = generateExportFilename(format, exportCount);
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      downloadFile(content, filename, mimeType);
      
      toast.success('Export successful!', {
        description: `Downloaded ${filename} with ${exportCount} analysis result${exportCount !== 1 ? 's' : ''}.`
      });
      
      onClose();
    } catch (error: any) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: error.message || 'Please try again or contact support.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Analysis Results
            </DialogTitle>
            <DialogDescription>
              Download your analysis results in CSV or JSON format for further processing or record keeping.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Export Scope Selection */}
            <div className="space-y-3">
              <h4 className="font-medium">What would you like to export?</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setExportType('all')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    exportType === 'all' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">All Results</span>
                    {exportType === 'all' && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Export all {analyses.length} analysis result{analyses.length !== 1 ? 's' : ''}
                  </p>
                </button>

                <button
                  onClick={() => setExportType('current')}
                  disabled={!currentAnalysis}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    exportType === 'current' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  } ${!currentAnalysis ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Current Result</span>
                    {exportType === 'current' && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentAnalysis ? 'Export only the current analysis' : 'No current analysis selected'}
                  </p>
                </button>
              </div>
            </div>

            <Separator />

            {/* Format Selection */}
            <div className="space-y-3">
              <h4 className="font-medium">Choose export format</h4>
              <div className="grid grid-cols-2 gap-3">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="w-4 h-4" />
                      CSV Format
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-3">
                      Structured data perfect for spreadsheets and data analysis tools
                    </CardDescription>
                    <Button
                      onClick={() => handleExport('csv')}
                      disabled={isExporting || exportCount === 0}
                      className="w-full gap-2"
                      size="sm"
                    >
                      {isExporting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                          />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Export CSV
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Code className="w-4 h-4" />
                      JSON Format
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-3">
                      Machine-readable format ideal for developers and API integration
                    </CardDescription>
                    <Button
                      onClick={() => handleExport('json')}
                      disabled={isExporting || exportCount === 0}
                      variant="outline"
                      className="w-full gap-2"
                      size="sm"
                    >
                      {isExporting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                          />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Export JSON
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Export Info */}
            {exportCount > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ready to export:</span>
                  <Badge variant="secondary">
                    {exportCount} result{exportCount !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}