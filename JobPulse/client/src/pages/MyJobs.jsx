import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiBookmark, FiCheckCircle, FiClock, FiSearch, FiTrash2 } from 'react-icons/fi';
import JobCard from '../components/JobCard';
import { useJobActivity } from '../hooks/useJobActivity';

const tabs = [
  {
    id: 'saved',
    label: 'Saved',
    icon: FiBookmark,
    emptyTitle: 'No saved jobs yet',
    emptyText: 'Bookmark jobs you want to revisit later.'
  },
  {
    id: 'recent',
    label: 'Recently Viewed',
    icon: FiClock,
    emptyTitle: 'No recently viewed jobs',
    emptyText: 'Jobs you open will appear here automatically.'
  },
  {
    id: 'applied',
    label: 'Applied',
    icon: FiCheckCircle,
    emptyTitle: 'No applied jobs yet',
    emptyText: 'Mark jobs as applied after opening the company apply link.'
  }
];

const isCurrentJob = (job) => {
  if (!job.lastDate) return true;

  const lastDate = new Date(job.lastDate);
  if (Number.isNaN(lastDate.getTime())) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);

  return lastDate >= today;
};

const sortByDate = (jobs, dateKey) => jobs.filter(isCurrentJob).sort((a, b) => (
  new Date(b[dateKey] || 0).getTime() - new Date(a[dateKey] || 0).getTime()
));

const MyJobs = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const { savedJobs, recentJobs, appliedJobs, clearCollection } = useJobActivity();

  const collections = useMemo(() => ({
    saved: sortByDate(savedJobs, 'savedAt'),
    recent: sortByDate(recentJobs, 'viewedAt'),
    applied: sortByDate(appliedJobs, 'appliedAt')
  }), [savedJobs, recentJobs, appliedJobs]);

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const jobs = collections[activeTab] || [];
  const ActiveIcon = activeTabConfig.icon;

  return (
    <>
      <Helmet>
        <title>My Jobs - JobPulse_24x7</title>
        <meta
          name="description"
          content="Track your saved, recently viewed, and applied jobs on JobPulse_24x7."
        />
      </Helmet>

      <section className="section-muted border-b border-borderSoft py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="font-heading text-3xl font-bold text-textDark md:text-4xl">
                My Jobs
              </h1>
              <p className="mt-2 max-w-2xl break-words text-muted">
                Your saved jobs, recently viewed roles, and applied jobs are stored safely in this browser.
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition-all hover:bg-primary/90 sm:w-auto"
            >
              <FiSearch className="h-5 w-5" />
              Find More Jobs
            </Link>
          </div>
        </div>
      </section>

      <section className="section min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`surface-card surface-card-hover flex items-center justify-between p-4 text-left ${
                    isActive ? 'border-primary/60 bg-primary/10' : ''
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-textDark">{tab.label}</span>
                      <span className="text-sm text-muted">{collections[tab.id].length} jobs</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-textDark">
              {activeTabConfig.label} Jobs
            </h2>
            {jobs.length > 0 && (
              <button
                type="button"
                onClick={() => clearCollection(activeTab)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-borderSoft px-4 py-2 text-sm font-medium text-muted transition-all hover:border-red-400/60 hover:text-red-500"
              >
                <FiTrash2 className="h-4 w-4" />
                Clear {activeTabConfig.label}
              </button>
            )}
          </div>

          {jobs.length === 0 ? (
            <div className="surface-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ActiveIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-textDark">{activeTabConfig.emptyTitle}</h3>
              <p className="mx-auto mt-2 max-w-md text-muted">{activeTabConfig.emptyText}</p>
              <Link
                to="/search"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-white transition-all hover:bg-primary/90"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="grid gap-5">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyJobs;
