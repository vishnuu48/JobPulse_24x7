const locations = [
  'Hyderabad',
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Pune',
  'Noida',
  'Gurgaon',
  'Kolkata',
  'Work From Home'
];

const jobTypes = [
  { value: 'Fresher', label: 'Fresher' },
  { value: 'Experienced', label: 'Experienced' },
  { value: 'Internship', label: 'Internship' },
  { value: 'WalkIn', label: 'Walk-In' },
  { value: 'WFH', label: 'Work From Home' }
];

const experiences = [
  { value: 'Fresher', label: 'Fresher' },
  { value: '0-1 years', label: '0-1 years' },
  { value: '1-2 years', label: '1-2 years' },
  { value: '2-3 years', label: '2-3 years' },
  { value: '3-5 years', label: '3-5 years' },
  { value: '5+ years', label: '5+ years' }
];

const qualifications = [
  'B.Tech',
  'MCA',
  'BCA',
  'BSc',
  'MBA',
  'B.Com',
  'Any Graduate',
  '12th Pass'
];

const Sidebar = ({ filters = {}, onFilterChange }) => {
  const getScalarFilter = (key) => {
    const value = filters[key];
    return Array.isArray(value) ? value[0] || '' : value || '';
  };

  const updateFilter = (key, value) => {
    if (onFilterChange.length >= 2) {
      onFilterChange(key, value);
      return;
    }

    onFilterChange({
      ...filters,
      [key]: Array.isArray(filters[key]) ? (value ? [value] : []) : value
    });
  };

  return (
    <div className="surface-card p-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-textDark mb-3">Location</h3>
        <select
          value={getScalarFilter('location')}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="w-full px-3 py-2 bg-background border border-borderSoft rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-textDark"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-textDark mb-3">Job Type</h3>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label key={type.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="jobType"
                value={type.value}
                checked={getScalarFilter('jobType') === type.value}
                onChange={(e) => updateFilter('jobType', e.target.value)}
                className="w-4 h-4 text-primary bg-background border-borderSoft focus:ring-primary"
              />
              <span className="ml-2 text-sm text-muted group-hover:text-primary">{type.label}</span>
            </label>
          ))}
          {filters.jobType && (
            <button
              onClick={() => updateFilter('jobType', '')}
              className="text-xs text-primary hover:text-primary/80 mt-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-textDark mb-3">Experience</h3>
        <div className="space-y-2">
          {experiences.map((exp) => (
            <label key={exp.value} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="experience"
                value={exp.value}
                checked={getScalarFilter('experience') === exp.value}
                onChange={(e) => updateFilter('experience', e.target.value)}
                className="w-4 h-4 text-primary bg-background border-borderSoft focus:ring-primary"
              />
              <span className="ml-2 text-sm text-muted group-hover:text-primary">{exp.label}</span>
            </label>
          ))}
          {filters.experience && (
            <button
              onClick={() => updateFilter('experience', '')}
              className="text-xs text-primary hover:text-primary/80 mt-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-textDark mb-3">Qualification</h3>
        <select
          value={getScalarFilter('qualification')}
          onChange={(e) => updateFilter('qualification', e.target.value)}
          className="w-full px-3 py-2 bg-background border border-borderSoft rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-textDark"
        >
          <option value="">All Qualifications</option>
          {qualifications.map((qual) => (
            <option key={qual} value={qual}>
              {qual}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Sidebar;
