const mongoose = require('mongoose');
const path = require('path');
const slugify = require('slugify');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Job = require('./models/Job');
const Category = require('./models/Category');
const Admin = require('./models/Admin');

const categories = [
  { name: 'IT Jobs', slug: 'it-jobs', icon: '💻', color: '#3b82f6' },
  { name: 'BPO Jobs', slug: 'bpo-jobs', icon: '📞', color: '#8b5cf6' },
  { name: 'Bank Jobs', slug: 'bank-jobs', icon: '🏦', color: '#10b981' },
  { name: 'Work From Home', slug: 'work-from-home', icon: '🏠', color: '#22c55e' },
  { name: 'Fresher Jobs', slug: 'fresher-jobs', icon: '🎓', color: '#f59e0b' },
  { name: 'Walk-In Jobs', slug: 'walk-in-jobs', icon: '🚶', color: '#ef4444' },
  { name: 'Big 4 Jobs', slug: 'big-4-jobs', icon: '🏢', color: '#6366f1' },
  { name: 'Startup Jobs', slug: 'startup-jobs', icon: '🚀', color: '#ec4899' },
  { name: 'Teaching Jobs', slug: 'teaching-jobs', icon: '📚', color: '#14b8a6' },
  { name: 'Pharma Jobs', slug: 'pharma-jobs', icon: '💊', color: '#f97316' }
];

const generateSlug = (title, company) => {
  const baseSlug = slugify(`${title} ${company}`, { lower: true, strict: true });
  return `${baseSlug}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
};

const generateJobs = (categoryMap) => {
  const jobsData = [
    // IT Jobs
    {
      title: 'Software Engineer - Java Developer',
      company: 'TCS',
      companyLogo: 'https://logo.clearbit.com/tcs.com',
      location: ['Hyderabad', 'Bangalore', 'Chennai'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['B.Tech', 'MCA', 'BSc'],
      category: categoryMap['IT Jobs'],
      salary: '₹3.5 - 6 LPA',
      applyLink: 'https://www.tcs.com/careers',
      description: `<h2>About TCS</h2>
<p>Tata Consultancy Services is an Indian multinational information technology services and consulting company.</p>
<h3>Job Description</h3>
<ul>
<li>Develop and maintain Java-based applications</li>
<li>Write clean, scalable code</li>
<li>Collaborate with cross-functional teams</li>
<li>Participate in code reviews</li>
</ul>
<h3>Requirements</h3>
<ul>
<li>Strong knowledge of Java programming</li>
<li>Understanding of OOPs concepts</li>
<li>Good communication skills</li>
</ul>`,
      tags: ['Java', 'Spring Boot', 'Microservices', 'TCS'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Associate Software Engineer',
      company: 'Infosys',
      companyLogo: 'https://logo.clearbit.com/infosys.com',
      location: ['Bangalore', 'Pune', 'Mysore'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['B.Tech', 'MCA', 'BCA'],
      category: categoryMap['IT Jobs'],
      salary: '₹3.6 - 5.5 LPA',
      applyLink: 'https://www.infosys.com/careers',
      description: `<h2>About Infosys</h2>
<p>Infosys is a global leader in next-generation digital services and consulting.</p>
<h3>Responsibilities</h3>
<ul>
<li>Design and develop software solutions</li>
<li>Work on cutting-edge technologies</li>
<li>Learn and grow with industry experts</li>
</ul>`,
      tags: ['Python', 'Java', 'Cloud', 'Infosys'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Project Engineer',
      company: 'Wipro',
      companyLogo: 'https://logo.clearbit.com/wipro.com',
      location: ['Hyderabad', 'Chennai', 'Noida'],
      jobType: 'Fresher',
      experience: '0-1 years',
      qualification: ['B.Tech', 'MCA'],
      category: categoryMap['IT Jobs'],
      salary: '₹3.5 - 5 LPA',
      applyLink: 'https://careers.wipro.com',
      description: `<h2>Project Engineer at Wipro</h2>
<p>Join Wipro's elite engineering team and work on transformative projects.</p>`,
      tags: ['.NET', 'Java', 'SQL', 'Wipro'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Software Developer - Full Stack',
      company: 'HCL Technologies',
      companyLogo: 'https://logo.clearbit.com/hcltech.com',
      location: ['Noida', 'Chennai', 'Bangalore'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['B.Tech', 'MCA', 'BSc'],
      category: categoryMap['IT Jobs'],
      salary: '₹4 - 6 LPA',
      applyLink: 'https://www.hcltech.com/careers',
      description: `<h2>Full Stack Developer Role</h2>
<p>HCL is looking for talented full stack developers.</p>`,
      tags: ['React', 'Node.js', 'MongoDB', 'HCL'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Programmer Analyst Trainee',
      company: 'Cognizant',
      companyLogo: 'https://logo.clearbit.com/cognizant.com',
      location: ['Chennai', 'Hyderabad', 'Pune'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['B.Tech', 'MCA', 'BCA'],
      category: categoryMap['IT Jobs'],
      salary: '₹4 - 5.5 LPA',
      applyLink: 'https://careers.cognizant.com',
      description: `<h2>GenC Program at Cognizant</h2>
<p>Start your career with Cognizant's GenC hiring program.</p>`,
      tags: ['Java', 'Python', 'GenC', 'Cognizant'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
    },

    // BPO Jobs
    {
      title: 'Customer Service Associate',
      company: 'Amazon',
      companyLogo: 'https://logo.clearbit.com/amazon.com',
      location: ['Hyderabad', 'Bangalore', 'Work From Home'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['Any Graduate', '12th Pass'],
      category: categoryMap['BPO Jobs'],
      salary: '₹2.5 - 4 LPA',
      applyLink: 'https://www.amazon.jobs',
      description: `<h2>Join Amazon Customer Service</h2>
<p>Help millions of customers with their queries.</p>`,
      tags: ['Customer Service', 'Voice Process', 'Amazon'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Voice Process Executive',
      company: 'Genpact',
      companyLogo: 'https://logo.clearbit.com/genpact.com',
      location: ['Hyderabad', 'Noida', 'Gurgaon'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['Any Graduate'],
      category: categoryMap['BPO Jobs'],
      salary: '₹2.2 - 3.5 LPA',
      applyLink: 'https://www.genpact.com/careers',
      description: `<h2>Voice Process at Genpact</h2>
<p>Handle customer calls professionally.</p>`,
      tags: ['Voice', 'BPO', 'Genpact'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'International Voice Process',
      company: 'Concentrix',
      companyLogo: 'https://logo.clearbit.com/concentrix.com',
      location: ['Bangalore', 'Hyderabad'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['Any Graduate'],
      category: categoryMap['BPO Jobs'],
      salary: '₹3 - 4.5 LPA',
      applyLink: 'https://www.concentrix.com/careers',
      description: `<h2>International Voice Process</h2>
<p>Work with US/UK clients.</p>`,
      tags: ['International', 'Voice', 'Concentrix'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
    },

    // Bank Jobs
    {
      title: 'Relationship Manager',
      company: 'HDFC Bank',
      companyLogo: 'https://logo.clearbit.com/hdfcbank.com',
      location: ['Mumbai', 'Delhi', 'Pune', 'Hyderabad'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['Any Graduate'],
      category: categoryMap['Bank Jobs'],
      salary: '₹3 - 5 LPA',
      applyLink: 'https://www.hdfcbank.com/careers',
      description: `<h2>RM at HDFC Bank</h2>
<p>Build relationships with customers.</p>`,
      tags: ['Banking', 'Sales', 'HDFC'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Probationary Officer',
      company: 'ICICI Bank',
      companyLogo: 'https://logo.clearbit.com/icicibank.com',
      location: ['All India'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['Any Graduate'],
      category: categoryMap['Bank Jobs'],
      salary: '₹5 - 7 LPA',
      applyLink: 'https://www.icicicareers.com',
      description: `<h2>PO Program at ICICI</h2>
<p>Start your banking career.</p>`,
      tags: ['PO', 'Banking', 'ICICI'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Sales Officer',
      company: 'Axis Bank',
      companyLogo: 'https://logo.clearbit.com/axisbank.com',
      location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['Any Graduate'],
      category: categoryMap['Bank Jobs'],
      salary: '₹3.5 - 5.5 LPA',
      applyLink: 'https://www.axisbank.com/careers',
      description: `<h2>Sales at Axis Bank</h2>
<p>Join the banking sector.</p>`,
      tags: ['Sales', 'Banking', 'Axis'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
    },

    // Work From Home
    {
      title: 'Content Writer - Remote',
      company: 'Upwork Clients',
      companyLogo: '',
      location: ['Work From Home'],
      jobType: 'WFH',
      experience: 'Fresher',
      qualification: ['Any Graduate'],
      category: categoryMap['Work From Home'],
      salary: '₹15,000 - 35,000/month',
      applyLink: 'https://www.upwork.com',
      description: `<h2>Remote Content Writing</h2>
<p>Work from anywhere.</p>`,
      tags: ['Content', 'Writing', 'Remote', 'WFH'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Data Entry Operator - Work From Home',
      company: 'Various Companies',
      companyLogo: '',
      location: ['Work From Home'],
      jobType: 'WFH',
      experience: 'Fresher',
      qualification: ['Any Graduate', '12th Pass'],
      category: categoryMap['Work From Home'],
      salary: '₹12,000 - 25,000/month',
      applyLink: 'https://example.com/apply',
      description: `<h2>Data Entry WFH Jobs</h2>
<p>Simple data entry work from home.</p>`,
      tags: ['Data Entry', 'WFH', 'Remote', 'Typing'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Customer Support - Remote',
      company: 'Tech Support Co',
      companyLogo: '',
      location: ['Work From Home'],
      jobType: 'WFH',
      experience: 'Fresher',
      qualification: ['Any Graduate'],
      category: categoryMap['Work From Home'],
      salary: '₹18,000 - 30,000/month',
      applyLink: 'https://example.com/apply',
      description: `<h2>Remote Customer Support</h2>
<p>Support customers from home.</p>`,
      tags: ['Support', 'WFH', 'Remote'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    },

    // Fresher Jobs
    {
      title: 'Graduate Trainee',
      company: 'Reliance Industries',
      companyLogo: 'https://logo.clearbit.com/ril.com',
      location: ['Mumbai', 'Jamnagar', 'Bangalore'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['B.Tech', 'MBA'],
      category: categoryMap['Fresher Jobs'],
      salary: '₹5 - 8 LPA',
      applyLink: 'https://careers.ril.com',
      description: `<h2>Graduate Trainee at Reliance</h2>
<p>Join India's largest company.</p>`,
      tags: ['Trainee', 'Graduate', 'Reliance'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Management Trainee',
      company: 'Hindustan Unilever',
      companyLogo: 'https://logo.clearbit.com/hul.co.in',
      location: ['Mumbai', 'Bangalore'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['MBA'],
      category: categoryMap['Fresher Jobs'],
      salary: '₹12 - 18 LPA',
      applyLink: 'https://www.hul.co.in/careers',
      description: `<h2>UFLP at HUL</h2>
<p>Unilever Future Leaders Program.</p>`,
      tags: ['FMCG', 'Management', 'HUL'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
    },

    // Walk-In Jobs
    {
      title: 'Walk-In Drive for Freshers',
      company: 'Tech Mahindra',
      companyLogo: 'https://logo.clearbit.com/techmahindra.com',
      location: ['Hyderabad', 'Pune'],
      jobType: 'WalkIn',
      experience: 'Fresher',
      qualification: ['B.Tech', 'MCA', 'BCA'],
      category: categoryMap['Walk-In Jobs'],
      salary: '₹3 - 4.5 LPA',
      applyLink: 'https://careers.techmahindra.com',
      description: `<h2>Walk-In Drive Details</h2>
<p><strong>Date:</strong> This Saturday & Sunday</p>
<p><strong>Time:</strong> 9 AM - 4 PM</p>
<p><strong>Venue:</strong> Tech Mahindra Campus, Hitech City</p>`,
      tags: ['Walk-In', 'Fresher', 'Tech Mahindra'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Walk-In Interview - BPO',
      company: 'Teleperformance',
      companyLogo: 'https://logo.clearbit.com/teleperformance.com',
      location: ['Hyderabad', 'Bangalore'],
      jobType: 'WalkIn',
      experience: 'Fresher',
      qualification: ['Any Graduate', '12th Pass'],
      category: categoryMap['Walk-In Jobs'],
      salary: '₹2 - 3.5 LPA',
      applyLink: 'https://jobs.teleperformance.com',
      description: `<h2>BPO Walk-In</h2>
<p>Walk-in every Monday to Friday.</p>`,
      tags: ['Walk-In', 'BPO', 'Teleperformance'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },

    // Big 4 Jobs
    {
      title: 'Audit Associate',
      company: 'Deloitte',
      companyLogo: 'https://logo.clearbit.com/deloitte.com',
      location: ['Mumbai', 'Bangalore', 'Delhi'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['B.Com', 'MBA'],
      category: categoryMap['Big 4 Jobs'],
      salary: '₹6 - 9 LPA',
      applyLink: 'https://www2.deloitte.com/careers',
      description: `<h2>Join Deloitte Audit Team</h2>
<p>Work with top clients.</p>`,
      tags: ['Audit', 'Finance', 'CA', 'Deloitte'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Advisory Associate',
      company: 'KPMG',
      companyLogo: 'https://logo.clearbit.com/kpmg.com',
      location: ['Mumbai', 'Bangalore', 'Chennai'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['MBA', 'B.Com', 'B.Tech'],
      category: categoryMap['Big 4 Jobs'],
      salary: '₹7 - 10 LPA',
      applyLink: 'https://home.kpmg/careers',
      description: `<h2>KPMG Advisory</h2>
<p>Shape the future of business.</p>`,
      tags: ['Consulting', 'Advisory', 'KPMG'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Tax Analyst',
      company: 'EY',
      companyLogo: 'https://logo.clearbit.com/ey.com',
      location: ['Gurgaon', 'Mumbai', 'Bangalore'],
      jobType: 'Fresher',
      experience: '0-1 years',
      qualification: ['B.Com', 'MBA'],
      category: categoryMap['Big 4 Jobs'],
      salary: '₹5.5 - 8 LPA',
      applyLink: 'https://www.ey.com/careers',
      description: `<h2>Tax Practice at EY</h2>
<p>Join the world's leading firm.</p>`,
      tags: ['Tax', 'Finance', 'EY'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Consultant',
      company: 'PwC',
      companyLogo: 'https://logo.clearbit.com/pwc.com',
      location: ['Mumbai', 'Delhi', 'Kolkata'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['MBA', 'B.Tech'],
      category: categoryMap['Big 4 Jobs'],
      salary: '₹8 - 12 LPA',
      applyLink: 'https://www.pwc.in/careers',
      description: `<h2>Consulting at PwC</h2>
<p>Solve complex business problems.</p>`,
      tags: ['Consulting', 'PwC', 'Strategy'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000)
    },

    // Startup Jobs
    {
      title: 'Software Development Engineer',
      company: 'Flipkart',
      companyLogo: 'https://logo.clearbit.com/flipkart.com',
      location: ['Bangalore'],
      jobType: 'Fresher',
      experience: '0-1 years',
      qualification: ['B.Tech', 'M.Tech'],
      category: categoryMap['Startup Jobs'],
      salary: '₹15 - 25 LPA',
      applyLink: 'https://www.flipkartcareers.com',
      description: `<h2>SDE at Flipkart</h2>
<p>Build products for millions.</p>`,
      tags: ['Java', 'Microservices', 'Flipkart'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Operations Executive',
      company: 'Swiggy',
      companyLogo: 'https://logo.clearbit.com/swiggy.com',
      location: ['Bangalore', 'Hyderabad', 'Mumbai'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['Any Graduate'],
      category: categoryMap['Startup Jobs'],
      salary: '₹3 - 4.5 LPA',
      applyLink: 'https://careers.swiggy.com',
      description: `<h2>Operations at Swiggy</h2>
<p>Join India's food delivery leader.</p>`,
      tags: ['Operations', 'Logistics', 'Swiggy'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Business Analyst',
      company: 'Zomato',
      companyLogo: 'https://logo.clearbit.com/zomato.com',
      location: ['Gurgaon', 'Work From Home'],
      jobType: 'Fresher',
      experience: '0-1 years',
      qualification: ['B.Tech', 'MBA'],
      category: categoryMap['Startup Jobs'],
      salary: '₹6 - 10 LPA',
      applyLink: 'https://www.zomato.com/careers',
      description: `<h2>BA Role at Zomato</h2>
<p>Drive business decisions with data.</p>`,
      tags: ['Analytics', 'SQL', 'Excel', 'Zomato'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
    },

    // Teaching Jobs
    {
      title: 'Online Tutor - Mathematics',
      company: 'BYJU\'S',
      companyLogo: 'https://logo.clearbit.com/byjus.com',
      location: ['Work From Home', 'Bangalore'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['B.Tech', 'BSc', 'MSc'],
      category: categoryMap['Teaching Jobs'],
      salary: '₹4 - 8 LPA',
      applyLink: 'https://byjus.com/careers',
      description: `<h2>Math Tutor at BYJU'S</h2>
<p>Teach students online.</p>`,
      tags: ['Teaching', 'Mathematics', 'BYJU\'S'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Academic Counselor',
      company: 'Unacademy',
      companyLogo: 'https://logo.clearbit.com/unacademy.com',
      location: ['Bangalore', 'Delhi', 'Work From Home'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['Any Graduate'],
      category: categoryMap['Teaching Jobs'],
      salary: '₹3 - 5 LPA',
      applyLink: 'https://unacademy.com/careers',
      description: `<h2>Counselor at Unacademy</h2>
<p>Guide students in their journey.</p>`,
      tags: ['Counseling', 'Education', 'Unacademy'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)
    },

    // Pharma Jobs
    {
      title: 'Medical Representative',
      company: 'Sun Pharma',
      companyLogo: 'https://logo.clearbit.com/sunpharma.com',
      location: ['Mumbai', 'Hyderabad', 'Delhi'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['B.Pharma', 'BSc'],
      category: categoryMap['Pharma Jobs'],
      salary: '₹3 - 5 LPA',
      applyLink: 'https://sunpharma.com/careers',
      description: `<h2>MR at Sun Pharma</h2>
<p>Promote pharmaceutical products.</p>`,
      tags: ['MR', 'Pharma', 'Sales', 'Sun Pharma'],
      isFeatured: true,
      lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Quality Analyst',
      company: 'Dr. Reddy\'s',
      companyLogo: 'https://logo.clearbit.com/drreddys.com',
      location: ['Hyderabad'],
      jobType: 'Fresher',
      experience: 'Fresher',
      qualification: ['B.Pharma', 'M.Pharma'],
      category: categoryMap['Pharma Jobs'],
      salary: '₹3.5 - 5.5 LPA',
      applyLink: 'https://careers.drreddys.com',
      description: `<h2>QA at Dr. Reddy's</h2>
<p>Ensure product quality.</p>`,
      tags: ['QA', 'Pharma', 'Quality', 'Dr Reddys'],
      isFeatured: false,
      lastDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
    }
  ];

  return jobsData.map(job => ({
    ...job,
    slug: generateSlug(job.title, job.company)
  }));
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Job.deleteMany({});
    await Category.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing data');

    const createdCategories = [];
    for (const cat of categories) {
      const category = new Category(cat);
      await category.save();
      createdCategories.push(category);
    }
    console.log(`Created ${createdCategories.length} categories`);

    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const jobsData = generateJobs(categoryMap);
    
    for (const jobData of jobsData) {
      const job = new Job(jobData);
      await job.save();
    }
    console.log(`Created ${jobsData.length} jobs`);

    for (const cat of createdCategories) {
      const count = await Job.countDocuments({ category: cat._id });
      await Category.findByIdAndUpdate(cat._id, { jobCount: count });
    }
    console.log('Updated category job counts');

    const admin = await Admin.create({
      name: 'Admin',
      email: 'admin@jobpulse247.com',
      password: 'admin123'
    });
    console.log(`Created admin: ${admin.email}`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@jobpulse247.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
