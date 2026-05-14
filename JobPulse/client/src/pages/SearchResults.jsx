import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { useSearchJobs, useCategories } from '../hooks/useJobs';
import JobList from '../components/JobList';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { corePublicMetrics } from '../utils/siteMetrics';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const query = searchParams.get('q') || '';
  const location = searchParams.get('loc') || '';
  const experience = searchParams.get('exp') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  
  const [filters, setFilters] = useState({
    location: location ? [location] : [],
    jobType: searchParams.get('jobType') || '',
    experience: experience,
    qualification: searchParams.getAll('qualification'),
    category: searchParams.get('category') || ''
  });

  const { data: categoriesData } = useCategories();
  const { data: jobsData, isLoading } = useSearchJobs({
    q: query,
    loc: filters.location.length > 0 ? filters.location : undefined,
    exp: filters.experience || undefined,
    jobType: filters.jobType || undefined,
    qualification: filters.qualification.length > 0 ? filters.qualification : undefined,
    category: filters.category || undefined,
    page,
    limit: 12
  });

  const categories = categoriesData?.data || [];
  const jobs = jobsData?.data || [];
  const pagination = jobsData?.pagination;

  useEffect(() => {
    setFilters({
      location: location ? [location] : [],
      jobType: searchParams.get('jobType') || '',
      experience: experience,
      qualification: searchParams.getAll('qualification'),
      category: searchParams.get('category') || ''
    });
  }, [location, experience, searchParams]);

  const handleFilterChange = (newFilters) => {
    const nextFilters = {
      location: Array.isArray(newFilters.location) ? newFilters.location : newFilters.location ? [newFilters.location] : [],
      jobType: newFilters.jobType || '',
      experience: newFilters.experience || '',
      qualification: Array.isArray(newFilters.qualification) ? newFilters.qualification : newFilters.qualification ? [newFilters.qualification] : [],
      category: newFilters.category || ''
    };

    setFilters(nextFilters);
    
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (nextFilters.location.length > 0) {
      params.set('loc', nextFilters.location[0]);
    }
    if (nextFilters.jobType) params.set('jobType', nextFilters.jobType);
    if (nextFilters.experience) params.set('exp', nextFilters.experience);
    if (nextFilters.qualification.length > 0) {
      nextFilters.qualification.forEach(qual => params.append('qualification', qual));
    }
    if (nextFilters.category) params.set('category', nextFilters.category);
    
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchTitle = query 
    ? `"${query}" Jobs` 
    : location 
    ? `Jobs in ${location}` 
    : 'Search Jobs';

  return (
    <>
      <Helmet>
        <title>{searchTitle} - JobsHunt</title>
        <meta 
          name="description" 
          content={`Search results for ${query || 'jobs'}. Found ${pagination?.total || 0} matching jobs. Apply now on JobsHunt.`} 
        />
      </Helmet>

      <div className="section-muted py-8 border-b border-borderSoft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar className="max-w-4xl mx-auto" />
          <div className="mx-auto mt-4 flex max-w-4xl flex-wrap justify-center gap-2">
            {corePublicMetrics.map((metric) => (
              <span
                key={metric.label}
                className="rounded-full border border-borderSoft bg-card px-3 py-1 text-xs font-semibold text-muted"
              >
                <span className="text-primary">{metric.value}</span> {metric.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <FiSearch className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-textDark">
              {query ? `Results for "${query}"` : 'All Jobs'}
            </h1>
          </div>
          <p className="text-muted">
            {pagination?.total || 0} jobs found
            {location && ` in ${location}`}
            {experience && ` for ${experience}`}
          </p>
        </motion.div>

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-borderSoft bg-card px-4 py-3 font-medium text-textDark"
          >
            <FiFilter />
            Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className={`lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
            <Sidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </div>

          <div className="lg:col-span-3">
            <JobList 
              jobs={jobs} 
              isLoading={isLoading}
              emptyMessage="No jobs found matching your search"
            />

            {pagination && pagination.pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;
