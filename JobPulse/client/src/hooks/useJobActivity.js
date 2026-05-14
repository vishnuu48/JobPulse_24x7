import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'jobpulse-job-activity';
const ACTIVITY_EVENT = 'jobpulse-job-activity-change';
const COLLECTION_LIMITS = {
  saved: 100,
  recent: 20,
  applied: 100
};

const emptyActivity = {
  saved: [],
  recent: [],
  applied: []
};

const getJobId = (jobOrId) => {
  if (!jobOrId) return '';
  return typeof jobOrId === 'string' ? jobOrId : jobOrId._id || jobOrId.id || '';
};

const normalizeJob = (job) => ({
  _id: getJobId(job),
  title: job.title || 'Untitled Job',
  company: job.company || '',
  companyLogo: job.companyLogo || '',
  jobImage: job.jobImage || '',
  slug: job.slug || '',
  location: Array.isArray(job.location) ? job.location : [],
  jobType: job.jobType || '',
  experience: job.experience || '',
  qualification: Array.isArray(job.qualification) ? job.qualification : [],
  category: job.category || null,
  salary: job.salary || '',
  applyLink: job.applyLink || '',
  lastDate: job.lastDate || '',
  postedDate: job.postedDate || '',
  tags: Array.isArray(job.tags) ? job.tags : []
});

const readActivity = () => {
  if (typeof window === 'undefined') return emptyActivity;

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      applied: Array.isArray(parsed.applied) ? parsed.applied : []
    };
  } catch {
    return emptyActivity;
  }
};

const writeActivity = (nextActivity) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextActivity));
  window.dispatchEvent(new Event(ACTIVITY_EVENT));
};

const upsertJob = (collection, job, timestampKey) => {
  const jobId = getJobId(job);
  if (!jobId) return collection;

  const now = new Date().toISOString();
  const snapshot = {
    ...normalizeJob(job),
    [timestampKey]: now
  };

  return [
    snapshot,
    ...collection.filter((item) => getJobId(item) !== jobId)
  ].slice(0, COLLECTION_LIMITS[timestampKey === 'viewedAt' ? 'recent' : timestampKey === 'appliedAt' ? 'applied' : 'saved']);
};

export const useJobActivity = () => {
  const [activity, setActivity] = useState(readActivity);

  useEffect(() => {
    const handleChange = () => setActivity(readActivity());

    window.addEventListener(ACTIVITY_EVENT, handleChange);
    window.addEventListener('storage', handleChange);

    return () => {
      window.removeEventListener(ACTIVITY_EVENT, handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  const updateActivity = useCallback((updater) => {
    const currentActivity = readActivity();
    const nextActivity = updater(currentActivity);
    writeActivity(nextActivity);
    setActivity(nextActivity);
    return nextActivity;
  }, []);

  const isSaved = useCallback((jobOrId) => {
    const jobId = getJobId(jobOrId);
    return activity.saved.some((job) => getJobId(job) === jobId);
  }, [activity.saved]);

  const isApplied = useCallback((jobOrId) => {
    const jobId = getJobId(jobOrId);
    return activity.applied.some((job) => getJobId(job) === jobId);
  }, [activity.applied]);

  const toggleSaved = useCallback((job) => {
    let nextSavedState = false;

    updateActivity((currentActivity) => {
      const jobId = getJobId(job);
      const alreadySaved = currentActivity.saved.some((item) => getJobId(item) === jobId);
      nextSavedState = !alreadySaved;

      return {
        ...currentActivity,
        saved: alreadySaved
          ? currentActivity.saved.filter((item) => getJobId(item) !== jobId)
          : upsertJob(currentActivity.saved, job, 'savedAt')
      };
    });

    return nextSavedState;
  }, [updateActivity]);

  const markRecentlyViewed = useCallback((job) => {
    updateActivity((currentActivity) => ({
      ...currentActivity,
      recent: upsertJob(currentActivity.recent, job, 'viewedAt')
    }));
  }, [updateActivity]);

  const markApplied = useCallback((job) => {
    updateActivity((currentActivity) => ({
      ...currentActivity,
      applied: upsertJob(currentActivity.applied, job, 'appliedAt')
    }));
  }, [updateActivity]);

  const removeApplied = useCallback((jobOrId) => {
    const jobId = getJobId(jobOrId);
    updateActivity((currentActivity) => ({
      ...currentActivity,
      applied: currentActivity.applied.filter((item) => getJobId(item) !== jobId)
    }));
  }, [updateActivity]);

  const clearCollection = useCallback((collectionName) => {
    if (!Object.prototype.hasOwnProperty.call(emptyActivity, collectionName)) return;
    updateActivity((currentActivity) => ({
      ...currentActivity,
      [collectionName]: []
    }));
  }, [updateActivity]);

  return {
    savedJobs: activity.saved,
    recentJobs: activity.recent,
    appliedJobs: activity.applied,
    isSaved,
    isApplied,
    toggleSaved,
    markRecentlyViewed,
    markApplied,
    removeApplied,
    clearCollection
  };
};
