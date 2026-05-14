export const searchRecommendations = [
  {
    label: 'Software Developer',
    keywords: ['software', 'softwa', 'developer', 'dev', 'coder', 'programmer', 'it']
  },
  {
    label: 'Frontend Developer',
    keywords: ['frontend', 'front end', 'react', 'ui', 'developer', 'javascript']
  },
  {
    label: 'Java Developer',
    keywords: ['java', 'spring', 'backend', 'developer', 'software']
  },
  {
    label: 'Python Developer',
    keywords: ['python', 'django', 'flask', 'developer', 'software']
  },
  {
    label: 'Bank Jobs',
    keywords: ['bank', 'banking', 'finance', 'relationship manager', 'po']
  },
  {
    label: 'Fresher Jobs',
    keywords: ['fresh', 'fresher', 'graduate', 'entry level', '0 years']
  },
  {
    label: 'Work From Home',
    keywords: ['work from home', 'wfh', 'remote', 'home']
  },
  {
    label: 'Walk-In Jobs',
    keywords: ['walk', 'walkin', 'walk-in', 'interview']
  },
  {
    label: 'BPO Jobs',
    keywords: ['bpo', 'voice', 'customer support', 'call center', 'process']
  },
  {
    label: 'Data Analyst',
    keywords: ['data', 'analyst', 'excel', 'sql', 'analytics']
  },
  {
    label: 'Internship',
    keywords: ['intern', 'internship', 'trainee']
  },
  {
    label: 'Pharma Jobs',
    keywords: ['pharma', 'medical', 'representative', 'mr', 'bpharma']
  }
];

export const getSearchRecommendations = (query = '') => {
  const normalizedQuery = query.trim().toLowerCase();
  const popular = ['Fresher Jobs', 'Work From Home', 'Software Developer', 'Bank Jobs', 'Walk-In Jobs'];

  if (!normalizedQuery) {
    return popular;
  }

  const scoredMatches = searchRecommendations
    .map((item, index) => {
      const label = item.label.toLowerCase();
      const keywordScore = item.keywords.reduce((score, keyword) => {
        const normalizedKeyword = keyword.toLowerCase();
        if (normalizedKeyword === normalizedQuery) return Math.max(score, 100);
        if (normalizedKeyword.startsWith(normalizedQuery)) return Math.max(score, 80);
        if (normalizedKeyword.includes(normalizedQuery)) return Math.max(score, 60);
        if (normalizedQuery.includes(normalizedKeyword)) return Math.max(score, 45);
        return score;
      }, 0);

      let labelScore = 0;
      if (label === normalizedQuery) labelScore = 110;
      else if (label.startsWith(normalizedQuery)) labelScore = 90;
      else if (label.includes(normalizedQuery)) labelScore = 70;

      return {
        label: item.label,
        score: Math.max(keywordScore, labelScore),
        index
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.label);

  if (scoredMatches.length === 0) {
    return popular;
  }

  const fallbackMatches = popular.filter((item) => !scoredMatches.includes(item));
  return [...scoredMatches, ...fallbackMatches].slice(0, 5);
};
