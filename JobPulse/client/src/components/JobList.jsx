import JobCard from './JobCard';
import { motion } from 'framer-motion';

const JobCardSkeleton = () => (
  <div className="card modern-skeleton">
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 bg-surfaceMuted rounded-lg" />
      <div className="flex-1">
        <div className="h-5 bg-surfaceMuted rounded w-3/4 mb-2" />
        <div className="h-4 bg-surfaceMuted rounded w-1/2" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-6 bg-surfaceMuted rounded-full w-20" />
      <div className="h-6 bg-surfaceMuted rounded-full w-24" />
    </div>
    <div className="mt-3 h-4 bg-surfaceMuted rounded w-2/3" />
    <div className="mt-4 pt-4 border-t border-borderSoft flex justify-between">
      <div className="h-4 bg-surfaceMuted rounded w-24" />
      <div className="h-8 bg-surfaceMuted rounded w-24" />
    </div>
  </div>
);

const JobList = ({ jobs, isLoading, emptyMessage = 'No jobs found' }) => {
  if (isLoading) {
    return (
      <div className="grid gap-6">
        {[...Array(6)].map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-textDark mb-2">{emptyMessage}</h3>
        <p className="text-muted">Try adjusting your filters or search criteria</p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job, index) => (
        <JobCard key={job._id} job={job} index={index} />
      ))}
    </div>
  );
};

export default JobList;
