import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import type { AnalysisResult } from '../lib/types-and-constants';

interface AdvancedSearchProps {
  analyses: AnalysisResult[];
  onFilter: (filteredAnalyses: AnalysisResult[]) => void;
}

interface SearchFilters {
  searchTerm: string;
  credibilityRange: [number, number];
  biasDirection: 'all' | 'left' | 'center' | 'right';
  sentiment: 'all' | 'positive' | 'neutral' | 'negative';
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'newest' | 'oldest' | 'credibility-high' | 'credibility-low' | 'bias-high' | 'bias-low';
}

export function AdvancedSearch({ analyses, onFilter }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    credibilityRange: [0, 100],
    biasDirection: 'all',
    sentiment: 'all',
    dateRange: 'all',
    sortBy: 'newest'
  });

  const applyFilters = () => {
    let filtered = [...analyses];

    // Search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(analysis =>
        analysis.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        analysis.url?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        analysis.keyFindings.some(finding => 
          finding.toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
      );
    }

    // Credibility range filter
    filtered = filtered.filter(analysis => {
      const credibility = 100 - analysis.fakeNewsScore;
      return credibility >= filters.credibilityRange[0] && credibility <= filters.credibilityRange[1];
    });

    // Bias direction filter
    if (filters.biasDirection !== 'all') {
      filtered = filtered.filter(analysis => analysis.biasDirection === filters.biasDirection);
    }

    // Sentiment filter
    if (filters.sentiment !== 'all') {
      filtered = filtered.filter(analysis => analysis.sentiment === filters.sentiment);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(analysis => analysis.timestamp >= filterDate);
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        break;
      case 'credibility-high':
        filtered.sort((a, b) => (100 - a.fakeNewsScore) - (100 - b.fakeNewsScore));
        break;
      case 'credibility-low':
        filtered.sort((a, b) => (100 - b.fakeNewsScore) - (100 - a.fakeNewsScore));
        break;
      case 'bias-high':
        filtered.sort((a, b) => Math.abs(b.biasScore) - Math.abs(a.biasScore));
        break;
      case 'bias-low':
        filtered.sort((a, b) => Math.abs(a.biasScore) - Math.abs(b.biasScore));
        break;
    }

    onFilter(filtered);
  };

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      credibilityRange: [0, 100],
      biasDirection: 'all',
      sentiment: 'all',
      dateRange: 'all',
      sortBy: 'newest'
    });
    onFilter(analyses);
  };

  const hasActiveFilters = filters.searchTerm || 
    filters.credibilityRange[0] > 0 || 
    filters.credibilityRange[1] < 100 ||
    filters.biasDirection !== 'all' ||
    filters.sentiment !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.sortBy !== 'newest';

  // Apply filters whenever they change
  useState(() => {
    applyFilters();
  });

  const getBiasIcon = (direction: string) => {
    switch (direction) {
      case 'left': return <TrendingDown className="h-3 w-3 text-blue-500" />;
      case 'right': return <TrendingUp className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {isExpanded ? 'Simple' : 'Advanced'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, URL, or findings..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-2 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Credibility Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Credibility: {filters.credibilityRange[0]}% - {filters.credibilityRange[1]}%
                  </label>
                  <Slider
                    value={filters.credibilityRange}
                    onValueChange={(value) => updateFilter('credibilityRange', value as [number, number])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Bias Direction */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bias Direction</label>
                  <Select
                    value={filters.biasDirection}
                    onValueChange={(value) => updateFilter('biasDirection', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Directions</SelectItem>
                      <SelectItem value="left">
                        <div className="flex items-center gap-2">
                          {getBiasIcon('left')} Left Leaning
                        </div>
                      </SelectItem>
                      <SelectItem value="center">
                        <div className="flex items-center gap-2">
                          {getBiasIcon('center')} Center/Neutral
                        </div>
                      </SelectItem>
                      <SelectItem value="right">
                        <div className="flex items-center gap-2">
                          {getBiasIcon('right')} Right Leaning
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sentiment */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sentiment</label>
                  <Select
                    value={filters.sentiment}
                    onValueChange={(value) => updateFilter('sentiment', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sentiments</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => updateFilter('dateRange', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Last 24 Hours</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => updateFilter('sortBy', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="credibility-high">High Credibility</SelectItem>
                      <SelectItem value="credibility-low">Low Credibility</SelectItem>
                      <SelectItem value="bias-high">High Bias</SelectItem>
                      <SelectItem value="bias-low">Low Bias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 pt-2 border-t"
          >
            {filters.searchTerm && (
              <Badge variant="secondary">
                Search: "{filters.searchTerm}"
              </Badge>
            )}
            {(filters.credibilityRange[0] > 0 || filters.credibilityRange[1] < 100) && (
              <Badge variant="secondary">
                Credibility: {filters.credibilityRange[0]}-{filters.credibilityRange[1]}%
              </Badge>
            )}
            {filters.biasDirection !== 'all' && (
              <Badge variant="secondary">
                Bias: {filters.biasDirection}
              </Badge>
            )}
            {filters.sentiment !== 'all' && (
              <Badge variant="secondary">
                Sentiment: {filters.sentiment}
              </Badge>
            )}
            {filters.dateRange !== 'all' && (
              <Badge variant="secondary">
                Date: {filters.dateRange}
              </Badge>
            )}
            {filters.sortBy !== 'newest' && (
              <Badge variant="secondary">
                Sort: {filters.sortBy}
              </Badge>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}