import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { useFeaturedJobs, useLatestJobs, useCategories } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import BrandLogo from '../components/BrandLogo';
import { publicMetrics } from '../utils/siteMetrics';

const popularLocations = [
  { name: 'Hyderabad', slug: 'hyderabad', jobs: '2500+' },
  { name: 'Bangalore', slug: 'bangalore', jobs: '3200+' },
  { name: 'Mumbai', slug: 'mumbai', jobs: '2800+' },
  { name: 'Delhi NCR', slug: 'delhi', jobs: '2100+' },
  { name: 'Chennai', slug: 'chennai', jobs: '1800+' },
  { name: 'Pune', slug: 'pune', jobs: '1500+' }
];

const Home = () => {
  const { data: featuredJobsData, isLoading: featuredLoading } = useFeaturedJobs();
  const { data: latestJobsData, isLoading: latestLoading } = useLatestJobs();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const featuredJobs = featuredJobsData?.data || [];
  const latestJobs = latestJobsData?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <>
      <Helmet>
        <title>JobPulse_24/7 - Find Your Dream Fresher Job in India</title>
        <meta
          name="description"
          content="Find the latest fresher jobs in IT, BPO, Banking, and more. JobPulse_24/7 helps freshers land their dream job at top companies."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section py-14 md:py-20 overflow-hidden border-b border-borderSoft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-8">
                <BrandLogo
                  className="w-20 h-20 md:w-28 md:h-28"
                  borderClassName="border-4"
                  shadowClassName="shadow-lg"
                  textClassName="text-xl md:text-3xl"
                  wrapperClassName="max-w-full"
                />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-4">
                Fresh Jobs, <span className="block text-primary sm:inline">Updated 24/7</span>
              </h1>
              <p className="text-base md:text-xl text-muted max-w-[18rem] sm:max-w-xl md:max-w-2xl mx-auto px-1">
                India's #1 Job Portal for Freshers. Find opportunities at top MNCs, startups, and more.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xs md:max-w-4xl mx-auto w-full"
          >
            <SearchBar />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid w-full grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-xs md:max-w-3xl mx-auto"
          >
            {publicMetrics.map((stat, i) => (
              <div key={i} className="text-center p-4 surface-card">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-textDark">
              Browse by Category
            </h2>
            <Link
              to="/categories"
              className="text-primary hover:text-primary/80 font-medium flex items-center"
            >
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {categoriesLoading ? (
            <LoadingSpinner compact label="Loading categories" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.slice(0, 10).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="block surface-card surface-card-hover p-4 group h-full"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-textDark group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted">{category.jobCount || 0} jobs</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-12 section-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-textDark">
              <FiTrendingUp className="inline-block mr-2 text-primary" />
              Featured Jobs
            </h2>
          </div>

          {featuredLoading ? (
            <LoadingSpinner compact label="Loading featured jobs" />
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-8 text-muted">No featured jobs available</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {featuredJobs.slice(0, 6).map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <JobCard job={job} featured />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-12 section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-textDark">
              Latest Jobs
            </h2>
            <Link
              to="/search"
              className="text-primary hover:text-primary/80 font-medium flex items-center"
            >
              View All Jobs <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {latestLoading ? (
            <LoadingSpinner compact label="Loading latest jobs" />
          ) : latestJobs.length === 0 ? (
            <div className="text-center py-8 text-muted">No jobs available</div>
          ) : (
            <div className="grid gap-4">
              {latestJobs.slice(0, 8).map((job, index) => (
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
          )}
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-12 section-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-textDark">
              <FiMapPin className="inline-block mr-2 text-primary" />
              Jobs by Location
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularLocations.map((location, index) => (
              <motion.div
                key={location.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/location/${location.slug}`}
                  className="block surface-card surface-card-hover p-4 text-center group"
                >
                  <FiMapPin className="mx-auto text-primary mb-2" size={24} />
                  <h3 className="font-semibold text-textDark group-hover:text-primary transition-colors">
                    {location.name}
                  </h3>
                  <p className="text-sm text-muted">{location.jobs} jobs</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 section relative overflow-hidden border-t border-borderSoft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <BrandLogo
              className="w-20 h-20"
              borderClassName="border-4"
              shadowClassName="shadow-lg"
              textClassName="text-xl"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-textDark">
            Ready to Start Your Career?
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Join thousands of freshers who found their dream job through JobPulse_24/7
          </p>
          <Link
            to="/search"
            className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all shadow-sm"
          >
            <FiBriefcase className="mr-2" />
            Explore All Jobs
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
