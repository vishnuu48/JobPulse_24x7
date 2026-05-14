import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiBriefcase, FiFilter, FiX } from 'react-icons/fi';
import { useCategory, useJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const Category = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
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

  const category = categoryData?.data;
  const jobs = jobsData?.data || [];
  const pagination = jobsData?.pagination || {};

  return (
    <>
      <Helmet>
        <title>{category?.name || 'Category'} Jobs - JobPulse_24/7</title>
        <meta
          name="description"
          content={`Find the latest ${category?.name || ''} jobs for freshers. Browse ${pagination.total || 0}+ job openings.`}
        />
      </Helmet>

      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: category?.color || '#f59e0b' }}
            >
              {category?.icon || '💼'}
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading">{category?.name || 'Category'}</h1>
              <p className="text-gray-300 mt-1">
                {pagination.total || 0} jobs available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            <FiFilter className="mr-2" />
            Filters
            {hasFilters && (
              <span className="ml-2 bg-white text-yellow-500 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-yellow-500 hover:text-yellow-600"
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
              <div className="text-center py-12 bg-white rounded-lg">
                <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-2 text-gray-500">
                  {hasFilters
                    ? 'Try adjusting your filters to see more results.'
                    : 'No jobs are currently available in this category.'}
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-yellow-500 hover:text-yellow-600"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-gray-600">
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
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                      Page {page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
    </>
  );
};

export default Category;
