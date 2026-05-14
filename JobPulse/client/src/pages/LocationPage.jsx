import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMapPin, FiFilter } from 'react-icons/fi';
import { useJobsByLocation, useCategories } from '../hooks/useJobs';
import JobList from '../components/JobList';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';

const LocationPage = () => {
  const { city } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const page = parseInt(searchParams.get('page')) || 1;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  
  const [filters, setFilters] = useState({
    location: [],
    jobType: searchParams.get('jobType') || '',
    experience: searchParams.get('experience') || '',
    qualification: searchParams.getAll('qualification'),
    category: searchParams.get('category') || ''
  });

  const { data: categoriesData } = useCategories();
  const { data: jobsData, isLoading } = useJobsByLocation(city, {
    ...filters,
    page,
    limit: 12
  });

  const categories = categoriesData?.data || [];
  const jobs = jobsData?.data || [];
  const pagination = jobsData?.pagination;

  const handleFilterChange = (newFilters) => {
    const nextFilters = {
      location: Array.isArray(newFilters.location) ? newFilters.location : [],
      jobType: newFilters.jobType || '',
      experience: newFilters.experience || '',
      qualification: Array.isArray(newFilters.qualification) ? newFilters.qualification : newFilters.qualification ? [newFilters.qualification] : [],
      category: newFilters.category || ''
    };

    setFilters(nextFilters);
    
    const params = new URLSearchParams();
    if (nextFilters.jobType) params.set('jobType', nextFilters.jobType);
    if (nextFilters.experience) params.set('experience', nextFilters.experience);
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

  return (
    <>
      <Helmet>
        <title>Jobs in {cityName} - Latest Job Openings | JobsHunt</title>
        <meta 
          name="description" 
          content={`Find ${pagination?.total || 0}+ jobs in ${cityName}. Browse IT, BPO, Bank, Fresher jobs in ${cityName}. Apply now on JobsHunt.`} 
        />
        <link rel="canonical" href={`https://jobshunt.com/location/${city}`} />
      </Helmet>

      <div className="section-muted py-12 border-b border-borderSoft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-textDark"
          >
            <div className="flex items-center justify-center mb-4">
              <FiMapPin className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
              Jobs in {cityName}
            </h1>
            <p className="text-muted">
              {pagination?.total || 0} jobs found
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 section">
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
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted">
                Showing {jobs.length} of {pagination?.total || 0} jobs
              </p>
            </div>

            <JobList 
              jobs={jobs} 
              isLoading={isLoading}
              emptyMessage={`No jobs found in ${cityName}`}
            />

            {pagination && (
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

export default LocationPage;
