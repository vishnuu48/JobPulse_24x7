import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiSearch,
  FiTrash2
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useAdminJobs, useDeleteJob, useToggleJob } from '../hooks/useJobs';
import LoadingSpinner from '../components/LoadingSpinner';
import { shouldUseCompanyLogo } from '../utils/companyLogo';
import { getMediaUrl } from '../utils/media';

const isExpiredJob = (job) => {
  if (!job.lastDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(job.lastDate) < today;
};

const ManageJobs = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useAdminJobs({ page, limit: 20, search });
  const deleteJob = useDeleteJob();
  const toggleJob = useToggleJob();

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteJob.mutateAsync(id);
      toast.success('Job deleted successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleJob.mutateAsync(id);
      toast.success('Job status updated');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle job status');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const jobs = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[rgb(var(--admin-muted))]">
            Admin / Jobs
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[rgb(var(--admin-text))]">Manage Jobs</h1>
          <p className="mt-2 text-[rgb(var(--admin-muted))]">
            Review listings, monitor status, and update job posts.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <form onSubmit={handleSearch} className="flex min-w-0">
            <div className="relative min-w-0 flex-1">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--admin-muted))]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="h-11 w-full rounded-l-lg border border-[rgb(var(--admin-border))] bg-[rgb(var(--admin-card))] pl-10 pr-4 text-sm text-[rgb(var(--admin-text))] outline-none transition focus:border-[rgb(var(--admin-primary))]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-r-lg bg-[rgb(var(--admin-primary))] px-4 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Search
            </button>
          </form>

          <Link
            to="/admin/jobs/add"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[rgb(var(--admin-primary))] px-5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <FiPlus className="h-4 w-4" />
            Add Job
          </Link>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="border-b border-[rgb(var(--admin-border))] px-5 py-4">
          <p className="text-sm text-[rgb(var(--admin-muted))]">
            Showing {jobs.length} of {pagination.total || 0} jobs
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="bg-[rgb(var(--admin-card-muted))] text-left text-xs font-semibold uppercase tracking-wide text-[rgb(var(--admin-muted))]">
                <th className="px-5 py-3">Job</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Posted</th>
                <th className="px-5 py-3">Apply Clicks</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--admin-border))]">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-[rgb(var(--admin-muted))]">
                    No jobs found. {search && 'Try a different search term or'}{' '}
                    <Link to="/admin/jobs/add" className="font-semibold text-[rgb(var(--admin-primary))] hover:underline">
                      add a new job
                    </Link>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const showCompanyLogo = shouldUseCompanyLogo(job.companyLogo);
                  const jobImageUrl = getMediaUrl(job.jobImage);
                  const expired = isExpiredJob(job);

                  return (
                    <tr key={job._id} className="transition-colors hover:bg-[rgb(var(--admin-card-muted))]/65">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {jobImageUrl ? (
                            <img
                              src={jobImageUrl}
                              alt={job.title}
                              className="h-12 w-16 rounded-lg border border-[rgb(var(--admin-border))] object-cover"
                            />
                          ) : showCompanyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={job.company}
                              className="h-12 w-12 rounded-lg border border-[rgb(var(--admin-border))] bg-white object-contain p-1"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--admin-primary))]/10 text-lg font-bold text-[rgb(var(--admin-primary))]">
                              {job.company?.charAt(0)?.toUpperCase() || 'J'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              to={`/admin/jobs/edit/${job._id}`}
                              className="block max-w-xs truncate font-semibold text-[rgb(var(--admin-text))] hover:text-[rgb(var(--admin-primary))]"
                            >
                              {job.title}
                            </Link>
                            <p className="max-w-xs truncate text-sm text-[rgb(var(--admin-muted))]">
                              {job.location?.join(', ') || 'No location'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[rgb(var(--admin-text))]">{job.company}</td>
                      <td className="px-5 py-4 text-[rgb(var(--admin-muted))]">
                        {job.category?.icon} {job.category?.name || 'N/A'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              expired
                                ? 'bg-orange-500/12 text-orange-600'
                                : job.isActive
                                ? 'bg-emerald-500/12 text-emerald-600'
                                : 'bg-rose-500/12 text-rose-600'
                            }`}
                          >
                            {expired ? 'Expired' : job.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {job.isFeatured && (
                            <span className="rounded-full bg-amber-500/14 px-2.5 py-1 text-xs font-semibold text-amber-600">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[rgb(var(--admin-muted))]">
                        {job.createdAt
                          ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
                          : 'N/A'}
                      </td>
                      <td className="px-5 py-4 text-[rgb(var(--admin-muted))]">
                        {job.applyClicks || 0}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggle(job._id)}
                            className="admin-icon-button"
                            title={job.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {job.isActive ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </button>
                          <Link
                            to={`/admin/jobs/edit/${job._id}`}
                            className="admin-icon-button text-blue-600"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(job._id, job.title)}
                            className="admin-icon-button text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex flex-col gap-3 border-t border-[rgb(var(--admin-border))] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[rgb(var(--admin-muted))]">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-lg border border-[rgb(var(--admin-border))] px-4 py-2 text-sm font-semibold text-[rgb(var(--admin-text))] transition hover:border-[rgb(var(--admin-primary))] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
                disabled={page === pagination.pages}
                className="rounded-lg border border-[rgb(var(--admin-border))] px-4 py-2 text-sm font-semibold text-[rgb(var(--admin-text))] transition hover:border-[rgb(var(--admin-primary))] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
