import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBookmark,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiExternalLink,
  FiMapPin
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { getCompanyInitial, shouldUseCompanyLogo } from '../utils/companyLogo';
import { useJobActivity } from '../hooks/useJobActivity';
import { jobsApi } from '../utils/api';
import { getMediaUrl } from '../utils/media';

const JobCard = ({ job, featured = false }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const [jobImageFailed, setJobImageFailed] = useState(false);
  const { isSaved, isApplied, toggleSaved, markApplied, removeApplied } = useJobActivity();
  const postedTime = job.postedDate 
    ? formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })
    : 'Recently';
  const companyInitial = getCompanyInitial(job.company);
  const showCompanyLogo = shouldUseCompanyLogo(job.companyLogo) && !logoFailed;
  const jobImageUrl = getMediaUrl(job.jobImage);
  const showJobImage = jobImageUrl && !jobImageFailed;
  const saved = isSaved(job);
  const applied = isApplied(job);

  const handleApplyClick = () => {
    markApplied(job);
    if (job._id) {
      jobsApi.trackApplyClick(job._id).catch(() => {});
    }
  };

  const handleAppliedToggle = () => {
    if (applied) {
      removeApplied(job);
      return;
    }

    markApplied(job);
  };

  return (
    <div className={`job-card bg-card rounded-xl p-5 border transition-all hover:shadow-md ${
      featured ? 'border-accent/40' : 'border-borderSoft hover:border-primary/40'
    }`}>
      {showJobImage && (
        <Link to={`/job/${job.slug}`} className="mb-4 block overflow-hidden rounded-lg border border-borderSoft bg-surfaceMuted">
          <img
            src={jobImageUrl}
            alt={`${job.title} job poster`}
            className="h-36 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            onError={() => setJobImageFailed(true)}
          />
        </Link>
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          {showCompanyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-14 h-14 rounded-xl object-cover bg-background"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-xl">{companyInitial}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <Link 
                    to={`/job/${job.slug}`}
                className="text-lg font-semibold text-textDark hover:text-primary transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
                  <p className="text-muted text-sm">{job.company}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  {featured && (
                    <span className="px-2 py-1 bg-accent/15 text-accent text-xs font-medium rounded-full whitespace-nowrap">
                      Featured
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleSaved(job)}
                    aria-pressed={saved}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                      saved
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-borderSoft text-muted hover:border-primary/40 hover:text-primary'
                    }`}
                    title={saved ? 'Remove bookmark' : 'Save job'}
                  >
                    <FiBookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted">
            <span className="flex items-center gap-1">
              <FiMapPin className="w-4 h-4 text-primary/70" />
              {job.location?.slice(0, 2).join(', ')}
              {job.location?.length > 2 && ` +${job.location.length - 2}`}
            </span>
            <span className="flex items-center gap-1">
              <FiBriefcase className="w-4 h-4 text-primary/70" />
              {job.experience || 'Fresher'}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1">
                <FiDollarSign className="w-4 h-4 text-primary/70" />
                {job.salary}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {job.qualification?.slice(0, 3).map((qual, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-surfaceMuted text-muted text-xs rounded-md border border-borderSoft"
              >
                {qual}
              </span>
            ))}
            {job.tags?.slice(0, 2).map((tag, i) => (
              <span 
                key={`tag-${i}`}
                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-borderSoft pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-1 text-xs text-muted">
          <FiClock className="w-3 h-3" />
          {postedTime}
        </span>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link
            to={`/job/${job.slug}`}
            className="inline-flex min-h-10 items-center justify-center px-3 py-2 text-sm text-muted hover:text-primary transition-colors"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={handleAppliedToggle}
            aria-pressed={applied}
            className={`inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              applied
                ? 'border-success/30 bg-success/10 text-success'
                : 'border-borderSoft text-muted hover:border-success/40 hover:text-success'
            }`}
          >
            <FiCheckCircle className="h-4 w-4" />
            {applied ? 'Applied' : 'Mark Applied'}
          </button>
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyClick}
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90"
          >
            Apply Now
            <FiExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
