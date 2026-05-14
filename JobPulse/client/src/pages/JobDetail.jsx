import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FiBookmark, FiMapPin, FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiEye, 
  FiExternalLink, FiShare2, FiChevronRight
} from 'react-icons/fi';
import { FaTelegram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { formatDistanceToNow, format } from 'date-fns';
import { useJob, useLatestJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { shouldUseCompanyLogo } from '../utils/companyLogo';
import { useJobActivity } from '../hooks/useJobActivity';
import { jobsApi } from '../utils/api';
import { getMediaUrl } from '../utils/media';

const JobDetail = () => {
  const { slug } = useParams();
  const { data: jobData, isLoading, error } = useJob(slug);
  const { data: latestJobsData } = useLatestJobs();
  const { isSaved, isApplied, toggleSaved, markRecentlyViewed, markApplied, removeApplied } = useJobActivity();
  const [jobImageFailed, setJobImageFailed] = useState(false);

  const job = jobData?.data;
  const relatedJobs = latestJobsData?.data?.filter(j => j.slug !== slug).slice(0, 3) || [];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = job ? `Check out this job: ${job.title} at ${job.company}` : '';

  const shareLinks = {
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
  };

  useEffect(() => {
    if (job?._id) {
      markRecentlyViewed(job);
      setJobImageFailed(false);
    }
  }, [job?._id, markRecentlyViewed]);

  if (isLoading) return <LoadingSpinner />;

  if (error || !job) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-textDark mb-2">Job Not Found</h1>
          <p className="text-muted mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn-primary">Browse Jobs</Link>
        </div>
      </div>
    );
  }

  const showCompanyLogo = shouldUseCompanyLogo(job.companyLogo);
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

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description?.replace(/<[^>]*>/g, ''),
    "datePosted": job.postedDate,
    "validThrough": job.lastDate,
    "employmentType": job.jobType === 'WFH' ? 'FULL_TIME' : job.jobType?.toUpperCase(),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "logo": showCompanyLogo ? job.companyLogo : undefined
    },
    "jobLocation": job.location?.map(loc => ({
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": loc,
        "addressCountry": "IN"
      }
    })),
    "baseSalary": job.salary && job.salary !== 'Not Disclosed' ? {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary
      }
    } : undefined
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <Helmet>
        <title>{job.title} at {job.company} - JobPulse_24x7</title>
        <meta name="description" content={`Apply for ${job.title} position at ${job.company}. Location: ${job.location?.join(', ')}. Experience: ${job.experience}. ${job.salary !== 'Not Disclosed' ? `Salary: ${job.salary}` : ''}`} />
        <meta property="og:title" content={`${job.title} at ${job.company}`} />
        <meta property="og:description" content={`Apply for ${job.title} at ${job.company}. ${job.location?.join(', ')}`} />
        {jobImageUrl && <meta property="og:image" content={jobImageUrl} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={shareUrl} />
        <link rel="canonical" href={shareUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="section py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center text-sm text-muted mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <FiChevronRight className="mx-2" />
          {job.category && (
            <>
              <Link to={`/category/${job.category.slug}`} className="hover:text-primary">
                {job.category.name}
              </Link>
              <FiChevronRight className="mx-2" />
            </>
          )}
          <span className="text-textDark truncate">{job.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="surface-card p-6 md:p-8">
              {showJobImage && (
                <div className="mb-6 overflow-hidden rounded-xl border border-borderSoft bg-surfaceMuted">
                  <img
                    src={jobImageUrl}
                    alt={`${job.title} job poster`}
                    className="max-h-[420px] w-full object-cover"
                    onError={() => setJobImageFailed(true)}
                  />
                </div>
              )}

              <div className="flex items-start gap-4 mb-6">
                {showCompanyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-20 h-20 rounded-xl object-contain bg-surfaceMuted p-2 border border-borderSoft"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-20 h-20 rounded-xl bg-primary flex items-center justify-center text-white text-2xl font-bold ${showCompanyLogo ? 'hidden' : ''}`}
                >
                  {getInitials(job.company)}
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-textDark font-heading mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg text-muted">{job.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`badge ${
                  job.jobType === 'WFH' ? 'badge-wfh' :
                  job.jobType === 'WalkIn' ? 'badge-walkin' :
                  job.jobType === 'Internship' ? 'badge-internship' :
                  'badge-fresher'
                }`}>
                  {job.jobType}
                </span>
                <span className="badge bg-surfaceMuted text-muted">
                  <FiBriefcase className="w-3 h-3 mr-1 inline" />
                  {job.experience}
                </span>
                {job.salary && job.salary !== 'Not Disclosed' && (
                  <span className="badge bg-success/10 text-success">
                    {job.salary}
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center text-muted">
                  <FiMapPin className="w-5 h-5 mr-2 text-primary" />
                  <span>{job.location?.join(', ')}</span>
                </div>
                <div className="flex items-center text-muted">
                  <FiCalendar className="w-5 h-5 mr-2 text-primary" />
                  <span>Posted {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}</span>
                </div>
                {job.lastDate && (
                  <div className="flex items-center text-muted">
                    <FiClock className="w-5 h-5 mr-2 text-primary" />
                    <span>Apply by {format(new Date(job.lastDate), 'dd MMM yyyy')}</span>
                  </div>
                )}
                <div className="flex items-center text-muted">
                  <FiEye className="w-5 h-5 mr-2 text-primary" />
                  <span>{job.views} views</span>
                </div>
              </div>

              {job.qualification?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-textDark mb-2">Qualifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.qualification.map((qual, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.tags?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-textDark mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-surfaceMuted text-muted rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <hr className="my-6 border-borderSoft" />

              <div className="prose prose-sm max-w-none">
                <h2 className="text-xl font-bold text-textDark mb-4">Job Description</h2>
                <div 
                  className="text-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => toggleSaved(job)}
                  className={`btn-secondary py-3 px-6 text-center flex items-center justify-center gap-2 ${
                    saved ? 'border-primary/40 bg-primary/10 text-primary' : ''
                  }`}
                >
                  <FiBookmark className="w-5 h-5" />
                  {saved ? 'Saved' : 'Save Job'}
                </button>
                <button
                  type="button"
                  onClick={handleAppliedToggle}
                  aria-pressed={applied}
                  className={`btn-secondary py-3 px-6 text-center flex items-center justify-center gap-2 ${
                    applied ? 'border-success/40 bg-success/10 text-success' : ''
                  }`}
                >
                  <FiCheckCircle className="w-5 h-5" />
                  {applied ? 'Applied' : 'Mark Applied'}
                </button>
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleApplyClick}
                  className="btn-primary py-3 px-8 text-center flex items-center justify-center gap-2 text-lg"
                >
                  Apply Now
                  <FiExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="surface-card p-6">
              <h3 className="font-semibold text-textDark mb-4 flex items-center gap-2">
                <FiShare2 />
                Share this Job
              </h3>
              <div className="flex gap-3">
                <a
                  href={shareLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#0088cc] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <FaTelegram className="w-5 h-5" />
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {relatedJobs.length > 0 && (
              <div>
                <h3 className="font-semibold text-textDark mb-4">Related Jobs</h3>
                <div className="space-y-4">
                  {relatedJobs.map((relatedJob) => (
                    <JobCard key={relatedJob._id} job={relatedJob} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
};

export default JobDetail;
