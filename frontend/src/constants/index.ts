export const ANALYSIS_STEPS = [
  'Extracting article content...',
  'Analyzing source credibility...',
  'Detecting bias patterns...',
  'Fact-checking claims...',
  'Evaluating emotional language...',
  'Generating final assessment...'
];

export const MOCK_TITLES = [
  'Breaking: Major Political Development Unfolds',
  'Scientists Announce Breakthrough Discovery',
  'Economic Markets Show Unexpected Trends',
  'Technology Giant Reveals New Innovation',
  'Health Officials Issue Important Statement',
  'Environmental Report Reveals New Data',
  'Global Trade Agreement Reaches Milestone',
  'Medical Research Shows Promising Results',
  'Education Reform Initiative Launches',
  'Infrastructure Project Gets Approval'
];

export const MOCK_FINDINGS = {
  SOURCE_HIGH: 'Source has high credibility rating',
  SOURCE_MODERATE: 'Source has moderate credibility rating',
  EMOTIONAL_LANGUAGE: 'Article contains emotional language',
  NEUTRAL_LANGUAGE: 'Language appears neutral',
  PARTIALLY_VERIFIABLE: 'Claims are partially verifiable',
  WELL_SOURCED: 'Most claims are well-sourced',
  MULTIPLE_SOURCES: 'Multiple sources cited',
  LIMITED_ATTRIBUTION: 'Limited source attribution',
  RED_FLAGS: 'Several red flags detected',
  NO_CONCERNS: 'No major credibility concerns identified',
  SENSATIONAL_HEADLINES: 'Article uses sensational headlines',
  FACTUAL_HEADLINES: 'Headlines appear factual',
  STATISTICAL_CLAIMS: 'Contains statistical claims',
  OPINION_BASED: 'Primarily opinion-based content'
};

export const STORAGE_KEY = 'truthlens-analysis-history';
export const MAX_HISTORY_ITEMS = 50;
export const ANALYSIS_STEP_DELAY = 800;
export const FINAL_DELAY = 500;
