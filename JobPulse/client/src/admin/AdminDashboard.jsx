import { Link } from 'react-router-dom';
import {
  FiAlertCircle,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiEye,
  FiGrid,
  FiHome,
  FiList,
  FiMousePointer,
  FiPlus,
  FiSearch,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { useJobStats, useAdminJobs, useCategories } from '../hooks/useJobs';

const formatNumber = (value) => Number(value || 0).toLocaleString();

const isExpiredJob = (job) => {
  if (!job.lastDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(job.lastDate) < today;
};

const StatCard = ({ icon: Icon, label, value, helper, tone = 'blue' }) => {
  const tones = {
    blue: 'bg-blue-500/12 text-blue-600',
    green: 'bg-emerald-500/12 text-emerald-600',
    amber: 'bg-amber-500/14 text-amber-600',
    rose: 'bg-rose-500/12 text-rose-600',
    sky: 'bg-sky-500/12 text-sky-600',
    slate: 'bg-slate-500/12 text-slate-600'
  };

  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[rgb(var(--admin-muted))]">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-normal text-[rgb(var(--admin-text))]">
            {value}
          </p>
          {helper && <p className="mt-1 text-xs text-[rgb(var(--admin-muted))]">{helper}</p>}
        </div>
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ to, icon: Icon, title, text, primary = false }) => (
  <Link
    to={to}
    className={`admin-card flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-[rgb(var(--admin-primary))] ${
      primary ? 'bg-[rgb(var(--admin-primary))] text-white' : ''
    }`}
  >
    <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
      primary ? 'bg-white/18 text-white' : 'bg-[rgb(var(--admin-card-muted))] text-[rgb(var(--admin-primary))]'
    }`}>
      <Icon className="h-6 w-6" />
    </span>
    <span className="min-w-0">
      <span className={`block text-lg font-semibold ${primary ? 'text-white' : 'text-[rgb(var(--admin-text))]'}`}>
        {title}
      </span>
      <span className={`text-sm ${primary ? 'text-white/78' : 'text-[rgb(var(--admin-muted))]'}`}>
        {text}
      </span>
    </span>
  </Link>
);

const AdminDashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useJobStats();
  const { data: recentJobsData, isLoading: jobsLoading } = useAdminJobs({ limit: 6 });
  const { data: categoriesData } = useCategories();

  const stats = statsData?.data || {};
  const recentJobs = recentJobsData?.data || [];
  const totalCategories = categoriesData?.data?.length || 0;
  const topCategories = stats.topCategories || [];
  const topSearchKeywords = stats.topSearchKeywords || [];

  const loadingValue = statsLoading ? '...' : null;

  return (
    <div className="space-y-8">
      <section className="admin-card overflow-hidden">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-7">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[rgb(var(--admin-card-muted))] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--admin-muted))]">
              <FiBarChart2 className="h-3.5 w-3.5" />
              Admin Overview
            </p>
            <h1 className="text-3xl font-bold tracking-normal text-[rgb(var(--admin-text))]">
              JobPulse_24x7 Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-[rgb(var(--admin-muted))]">
              Track listings, applications, search demand, and category performance from one clean workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/admin/jobs/add"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[rgb(var(--admin-primary))] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-105"
            >
              <FiPlus className="h-4 w-4" />
              Add Job
            </Link>
            <Link
              to="/admin/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[rgb(var(--admin-border))] bg-[rgb(var(--admin-card-muted))] px-5 py-3 text-sm font-semibold text-[rgb(var(--admin-text))] transition-all hover:border-[rgb(var(--admin-primary))]"
            >
              <FiList className="h-4 w-4" />
              Manage Jobs
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          icon={FiBriefcase}
          label="Total Jobs"
          value={loadingValue ?? formatNumber(stats.totalJobs)}
          helper="All listings"
          tone="blue"
        />
        <StatCard
          icon={FiUsers}
          label="Active Jobs"
          value={loadingValue ?? formatNumber(stats.activeJobs)}
          helper="Visible to users"
          tone="green"
        />
        <StatCard
          icon={FiAlertCircle}
          label="Expired Hidden"
          value={loadingValue ?? formatNumber(stats.expiredJobs)}
          helper="Auto-filtered"
          tone="rose"
        />
        <StatCard
          icon={FiEye}
          label="Total Views"
          value={loadingValue ?? formatNumber(stats.totalViews)}
          helper="Job detail opens"
          tone="sky"
        />
        <StatCard
          icon={FiMousePointer}
          label="Apply Clicks"
          value={loadingValue ?? formatNumber(stats.totalApplyClicks)}
          helper={`${stats.applyConversionRate || 0}% conversion`}
          tone="amber"
        />
        <StatCard
          icon={FiCalendar}
          label="Added Today"
          value={loadingValue ?? formatNumber(stats.jobsToday)}
          helper="New listings"
          tone="slate"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickAction to="/admin/jobs/add" icon={FiPlus} title="Add Job" text="Create a new listing" primary />
        <QuickAction to="/admin/jobs" icon={FiList} title="Manage Jobs" text={`${formatNumber(stats.totalJobs)} total jobs`} />
        <QuickAction to="/admin/categories" icon={FiGrid} title="Categories" text={`${totalCategories} categories`} />
        <QuickAction to="/" icon={FiHome} title="View Site" text="Open public website" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="admin-card p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[rgb(var(--admin-text))]">
                <FiTrendingUp className="text-[rgb(var(--admin-primary))]" />
                Category Popularity
              </h2>
              <p className="text-sm text-[rgb(var(--admin-muted))]">Ranked by views, clicks, and active jobs.</p>
            </div>
            <span className="rounded-full bg-[rgb(var(--admin-card-muted))] px-3 py-1 text-sm font-semibold text-[rgb(var(--admin-muted))]">
              {stats.applyConversionRate || 0}% apply rate
            </span>
          </div>

          {topCategories.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[rgb(var(--admin-border))] p-6 text-center text-[rgb(var(--admin-muted))]">
              No category activity yet.
            </p>
          ) : (
            <div className="space-y-3">
              {topCategories.slice(0, 5).map((category) => {
                const views = category.views || 0;
                const applyClicks = category.applyClicks || 0;
                const width = Math.min(100, Math.max(8, (views / Math.max(1, stats.totalViews || views || 1)) * 100));

                return (
                  <div key={category.categoryId || category.slug} className="rounded-xl border border-[rgb(var(--admin-border))] bg-[rgb(var(--admin-card-muted))]/60 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[rgb(var(--admin-text))]">
                          {category.icon} {category.name}
                        </p>
                        <p className="text-sm text-[rgb(var(--admin-muted))]">{category.jobCount} active jobs</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[rgb(var(--admin-text))]">{formatNumber(views)} views</p>
                        <p className="text-xs text-[rgb(var(--admin-muted))]">{formatNumber(applyClicks)} apply clicks</p>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/60 dark:bg-slate-950/60">
                      <div
                        className="h-full rounded-full bg-[rgb(var(--admin-primary))]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="admin-card p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[rgb(var(--admin-text))]">
                <FiSearch className="text-[rgb(var(--admin-primary))]" />
                Search Keywords
              </h2>
              <p className="text-sm text-[rgb(var(--admin-muted))]">What users are searching for.</p>
            </div>
            <span className="text-sm font-medium text-[rgb(var(--admin-muted))]">Top searches</span>
          </div>

          {topSearchKeywords.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[rgb(var(--admin-border))] p-6 text-center text-[rgb(var(--admin-muted))]">
              Search terms will appear after users search from the site.
            </p>
          ) : (
            <div className="space-y-3">
              {topSearchKeywords.slice(0, 6).map((keyword) => (
                <div key={keyword._id || keyword.keyword} className="flex items-center justify-between gap-4 rounded-xl border border-[rgb(var(--admin-border))] bg-[rgb(var(--admin-card-muted))]/60 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[rgb(var(--admin-text))]">{keyword.displayKeyword || keyword.keyword}</p>
                    <p className="text-xs text-[rgb(var(--admin-muted))]">{keyword.lastResults || 0} results last search</p>
                  </div>
                  <span className="rounded-full bg-[rgb(var(--admin-primary))]/10 px-3 py-1 text-sm font-semibold text-[rgb(var(--admin-primary))]">
                    {keyword.count}x
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[rgb(var(--admin-border))] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[rgb(var(--admin-text))]">Recent Jobs</h2>
            <p className="text-sm text-[rgb(var(--admin-muted))]">Latest listings created by admin.</p>
          </div>
          <Link to="/admin/jobs" className="text-sm font-semibold text-[rgb(var(--admin-primary))] hover:underline">
            View All
          </Link>
        </div>

        {jobsLoading ? (
          <div className="space-y-3 p-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-[rgb(var(--admin-card-muted))]" />
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <p className="p-8 text-center text-[rgb(var(--admin-muted))]">No jobs found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-[rgb(var(--admin-card-muted))] text-left text-xs font-semibold uppercase tracking-wide text-[rgb(var(--admin-muted))]">
                  <th className="px-5 py-3">Job Title</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Views</th>
                  <th className="px-5 py-3">Apply Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--admin-border))]">
                {recentJobs.map((job) => {
                  const expired = isExpiredJob(job);

                  return (
                    <tr key={job._id} className="transition-colors hover:bg-[rgb(var(--admin-card-muted))]/70">
                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/jobs/edit/${job._id}`}
                          className="font-semibold text-[rgb(var(--admin-text))] hover:text-[rgb(var(--admin-primary))]"
                        >
                          {job.title}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-[rgb(var(--admin-muted))]">{job.company}</td>
                      <td className="px-5 py-4 text-[rgb(var(--admin-muted))]">{job.category?.name || '-'}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          expired
                            ? 'bg-orange-500/12 text-orange-600'
                            : job.isActive
                            ? 'bg-emerald-500/12 text-emerald-600'
                            : 'bg-slate-500/12 text-slate-500'
                        }`}>
                          {expired ? 'Expired' : job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[rgb(var(--admin-muted))]">{formatNumber(job.views)}</td>
                      <td className="px-5 py-4 text-[rgb(var(--admin-muted))]">{formatNumber(job.applyClicks)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
