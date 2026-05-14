import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBriefcase } from 'react-icons/fi';
import SearchSuggestions from './SearchSuggestions';

const locations = [
  'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Noida', 'Gurgaon', 'Kolkata', 'Work From Home'
];

const jobTypes = [
  { value: '', label: 'All Types' },
  { value: 'Fresher', label: 'Fresher' },
  { value: 'Experienced', label: 'Experienced' },
  { value: 'Internship', label: 'Internship' },
  { value: 'WalkIn', label: 'Walk-In' },
  { value: 'WFH', label: 'Work From Home' }
];

const SearchBar = ({ className = '' }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigateToSearch = (nextQuery = query) => {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set('q', nextQuery.trim());
    if (location) params.set('loc', location);
    if (jobType) params.set('jobType', jobType);
    const queryString = params.toString();
    navigate(queryString ? `/search?${queryString}` : '/search');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigateToSearch();
  };

  const handleSuggestionSelect = (recommendation) => {
    setQuery(recommendation);
    setShowSuggestions(false);
    navigateToSearch(recommendation);
  };

  return (
    <form onSubmit={handleSubmit} className={`search-panel surface-card w-full max-w-full overflow-hidden p-4 md:p-6 ${className}`}>
      <div className="grid min-w-0 md:grid-cols-3 gap-4">
        <div className="relative min-w-0">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
            placeholder="Job title, company, or keywords"
            className="w-full min-w-0 pl-12 pr-4 py-3 bg-background border border-borderSoft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base text-textDark placeholder-muted"
          />
          <SearchSuggestions
            query={query}
            visible={showSuggestions}
            onSelect={handleSuggestionSelect}
          />
        </div>

        <div className="relative min-w-0">
          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full min-w-0 pl-12 pr-4 py-3 bg-background border border-borderSoft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base text-textDark appearance-none cursor-pointer"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="relative min-w-0">
          <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full min-w-0 pl-12 pr-4 py-3 bg-background border border-borderSoft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base text-textDark appearance-none cursor-pointer"
          >
            {jobTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <FiSearch className="w-5 h-5" />
        Search Jobs
      </button>
    </form>
  );
};

export default SearchBar;
