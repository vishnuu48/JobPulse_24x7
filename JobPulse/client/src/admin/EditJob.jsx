import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiImage, FiSave, FiPlus, FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCategories, useJobById, useUpdateJob } from '../hooks/useJobs';
import LoadingSpinner from '../components/LoadingSpinner';
import { jobsApi } from '../utils/api';
import { getMediaUrl } from '../utils/media';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: jobData, isLoading: jobLoading } = useJobById(id);
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const updateJob = useUpdateJob();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogo: '',
    jobImage: '',
    location: [],
    jobType: 'Fresher',
    experience: 'Fresher',
    qualification: [],
    category: '',
    salary: '',
    applyLink: '',
    description: '',
    lastDate: '',
    tags: [],
    isFeatured: false,
    isActive: true
  });

  const [locationInput, setLocationInput] = useState('');
  const [qualificationInput, setQualificationInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedJobImage, setSelectedJobImage] = useState(null);
  const [jobImagePreview, setJobImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (jobData?.data) {
      const job = jobData.data;
      setFormData({
        title: job.title || '',
        company: job.company || '',
        companyLogo: job.companyLogo || '',
        jobImage: job.jobImage || '',
        location: job.location || [],
        jobType: job.jobType || 'Fresher',
        experience: job.experience || 'Fresher',
        qualification: job.qualification || [],
        category: job.category?._id || job.category || '',
        salary: job.salary || '',
        applyLink: job.applyLink || '',
        description: job.description || '',
        lastDate: job.lastDate ? new Date(job.lastDate).toISOString().split('T')[0] : '',
        tags: job.tags || [],
        isFeatured: job.isFeatured || false,
        isActive: job.isActive !== undefined ? job.isActive : true
      });
    }
  }, [jobData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleJobImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Job image must be 5MB or smaller');
      return;
    }

    setSelectedJobImage(file);
    setJobImagePreview(URL.createObjectURL(file));
  };

  const removeJobImage = () => {
    setSelectedJobImage(null);
    setJobImagePreview('');
    setFormData(prev => ({
      ...prev,
      jobImage: ''
    }));
  };

  const addLocation = () => {
    if (locationInput.trim() && !formData.location.includes(locationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        location: [...prev.location, locationInput.trim()]
      }));
      setLocationInput('');
    }
  };

  const removeLocation = (loc) => {
    setFormData(prev => ({
      ...prev,
      location: prev.location.filter(l => l !== loc)
    }));
  };

  const addQualification = () => {
    if (qualificationInput.trim() && !formData.qualification.includes(qualificationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        qualification: [...prev.qualification, qualificationInput.trim()]
      }));
      setQualificationInput('');
    }
  };

  const removeQualification = (qual) => {
    setFormData(prev => ({
      ...prev,
      qualification: prev.qualification.filter(q => q !== qual)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.category || !formData.applyLink) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.location.length === 0) {
      toast.error('Please add at least one location');
      return;
    }

    try {
      setImageUploading(true);
      let jobImage = formData.jobImage;

      if (selectedJobImage) {
        const uploadResponse = await jobsApi.uploadImage(selectedJobImage);
        jobImage = uploadResponse.data?.data?.url || '';
      }

      await updateJob.mutateAsync({
        id,
        data: {
          ...formData,
          jobImage
        }
      });
      toast.success('Job updated successfully!');
      navigate('/admin/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job');
    } finally {
      setImageUploading(false);
    }
  };

  if (jobLoading || categoriesLoading) {
    return <LoadingSpinner />;
  }

  const categories = categoriesData?.data || [];
  const previewUrl = jobImagePreview || getMediaUrl(formData.jobImage);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/admin/jobs"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Back to Jobs
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g. TCS"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo URL
                </label>
                <input
                  type="text"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="https://example.com/company-logo.png"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Post Image
                </label>
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={previewUrl}
                        alt="Job post preview"
                        className="max-h-64 w-full rounded-lg border border-gray-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeJobImage}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <FiX className="h-4 w-4" />
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                      <FiImage className="h-10 w-10 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Upload a banner or poster for this job</p>
                        <p className="text-xs text-gray-500">JPG, PNG, WEBP, or GIF up to 5MB. This image will appear on the website and Telegram.</p>
                      </div>
                    </div>
                  )}
                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                    <FiUpload className="h-4 w-4" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleJobImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                  <option value="Internship">Internship</option>
                  <option value="WalkIn">Walk-In</option>
                  <option value="WFH">Work From Home</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-3 years">2-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g. ₹4-6 LPA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Date to Apply
                </label>
                <input
                  type="date"
                  name="lastDate"
                  value={formData.lastDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply Link *
              </label>
              <input
                type="url"
                name="applyLink"
                value={formData.applyLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="https://careers.company.com/apply"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locations *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Add location (e.g. Hyderabad, Bangalore)"
                />
                <button
                  type="button"
                  onClick={addLocation}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.location.map(loc => (
                  <span
                    key={loc}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {loc}
                    <button
                      type="button"
                      onClick={() => removeLocation(loc)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualifications
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={qualificationInput}
                  onChange={(e) => setQualificationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Add qualification (e.g. B.Tech, MCA)"
                />
                <button
                  type="button"
                  onClick={addQualification}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.qualification.map(qual => (
                  <span
                    key={qual}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {qual}
                    <button
                      type="button"
                      onClick={() => removeQualification(qual)}
                      className="ml-2 text-blue-500 hover:text-red-500"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Add tag (e.g. Java, React)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-yellow-500 hover:text-red-500"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description (HTML supported)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="<h2>About the Role</h2><p>Description here...</p>"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Job</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <Link
                to="/admin/jobs"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateJob.isPending || imageUploading}
                className="inline-flex items-center px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {updateJob.isPending || imageUploading ? 'Updating...' : 'Update Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
