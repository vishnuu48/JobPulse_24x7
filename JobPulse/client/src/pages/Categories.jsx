import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBriefcase } from 'react-icons/fi';
import { useCategories } from '../hooks/useJobs';
import LoadingSpinner from '../components/LoadingSpinner';

const Categories = () => {
  const { data, isLoading } = useCategories();
  const categories = data?.data || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Job Categories - JobPulse_24/7</title>
        <meta
          name="description"
          content="Browse job categories on JobPulse_24/7 and find fresher openings across IT, BPO, banking, work from home, and more."
        />
      </Helmet>

      <section className="section border-b border-borderSoft py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <FiBriefcase className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-textDark">
              Job Categories
            </h1>
            <p className="text-muted mt-3">
              Browse openings by role, industry, and work style.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length === 0 ? (
            <div className="text-center py-16 surface-card">
              <FiBriefcase className="mx-auto h-12 w-12 text-muted" />
              <h2 className="mt-4 text-lg font-medium text-textDark">No categories found</h2>
              <p className="mt-2 text-muted">Please check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {categories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="group block h-full surface-card surface-card-hover p-5"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${category.color || '#eab308'}20` }}
                    >
                      {category.icon || '💼'}
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold text-textDark group-hover:text-primary transition-colors">
                          {category.name}
                        </h2>
                        <p className="text-sm text-muted mt-1">
                          {category.jobCount || 0} jobs available
                        </p>
                      </div>
                      <FiArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Categories;
