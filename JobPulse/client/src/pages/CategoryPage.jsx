import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiFilter, FiBriefcase, FiX } from 'react-icons/fi';
import { useJobs, useCategory } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    experience: searchParams.get('experience') || '',
    qualification: searchParams.get('qualification') || ''
  });

  const { data: categoryData, isLoading: categoryLoading } = useCategory(slug);
  const { data: jobsData, isLoading: jobsLoading, refetch } = useJobs({
    category: slug,
    page,
    limit: 12,
    ...filters
  });

  const category = categoryData?.data;
  const jobs = jobsData?.data || [];
  const pagination = jobsData?.pagination || {};

  useEffect(() => {
    setPage(1);
    refetch();
  }, [slug, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      jobType: '',
      experience: '',
      qualification: ''
    });
    setSearchParams({});
  };

  const hasFilters = Object.values(filters).some(v => v);

  if (categoryLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{category?.name || 'Category'} - JobPulse_24/7</title>
        <meta 
          name="description" 
          content={`Browse ${pagination.total || 0}+ ${category?.name || ''} jobs. Find latest openings from top companies.`} 
        />
      </Helmet>

      <div className="section-muted py-12 border-b border-borderSoft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-textDark"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-2 border-primary/30"
              style={{ backgroundColor: `${category?.color}20` }}
            >
              {category?.icon || '💼'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
              {category?.name || 'Jobs'}
            </h1>
            <p className="text-muted">
              {pagination.total || 0} jobs available
            </p>
          </motion.div>
        </div>
      </div>

      <div className="section min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-white"
            >
              <FiFilter />
              Filters
              {hasFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white">
                  {Object.values(filters).filter(v => v).length}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className={`lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-textDark">Filters</h2>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary/80"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <Sidebar filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </div>

            <div className="flex-1">
              {jobsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 surface-card">
                  <FiBriefcase className="mx-auto h-12 w-12 text-muted" />
                  <h3 className="mt-4 text-lg font-medium text-textDark">No jobs found</h3>
                  <p className="mt-2 text-muted">
                    {hasFilters
                      ? 'Try adjusting your filters to see more results.'
                      : 'No jobs are currently available in this category.'}
                  </p>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-primary hover:text-primary/80"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-muted">
                      Showing {jobs.length} of {pagination.total} jobs
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {jobs.map((job, index) => (
                      <motion.div
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <JobCard job={job} />
                      </motion.div>
                    ))}
                  </div>

                  {pagination.pages > 1 && (
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-card border border-borderSoft rounded-lg text-textDark hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-2 py-2 text-sm text-muted sm:px-4 sm:text-base">
                        Page {page} of {pagination.pages}
                      </span>
                      <button
                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                        disabled={page === pagination.pages}
                        className="px-4 py-2 bg-card border border-borderSoft rounded-lg text-textDark hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
