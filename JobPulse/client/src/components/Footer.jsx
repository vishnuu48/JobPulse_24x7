import { Link } from 'react-router-dom';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { FaTelegram, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import BrandLogo from './BrandLogo';
import { corePublicMetrics } from '../utils/siteMetrics';

const Footer = () => {
  const categories = [
    { name: 'IT Jobs', slug: 'it-jobs' },
    { name: 'BPO Jobs', slug: 'bpo-jobs' },
    { name: 'Bank Jobs', slug: 'bank-jobs' },
    { name: 'Work From Home', slug: 'work-from-home' },
    { name: 'Fresher Jobs', slug: 'fresher-jobs' },
    { name: 'Big 4 Jobs', slug: 'big-4-jobs' }
  ];

  const locations = [
    { name: 'Hyderabad', slug: 'hyderabad' },
    { name: 'Bangalore', slug: 'bangalore' },
    { name: 'Mumbai', slug: 'mumbai' },
    { name: 'Delhi', slug: 'delhi' },
    { name: 'Pune', slug: 'pune' },
    { name: 'Chennai', slug: 'chennai' }
  ];

  return (
    <footer className="bg-card text-muted border-t border-borderSoft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <BrandLogo className="w-14 h-14" textClassName="text-lg" />
            </Link>
            <p className="text-sm mb-4 text-muted">
              India's leading job portal for freshers. Find your dream job from top companies across India.
            </p>
            <p className="mb-4 text-xs font-medium text-muted">
              {corePublicMetrics.map((metric) => `${metric.value} ${metric.label}`).join(' • ')}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/jobpulse_24x7/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-[#E4405F] transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://t.me/jobpulse_24x7" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-gray-500 hover:text-[#0088cc] transition-colors">
                <FaTelegram className="w-5 h-5" />
              </a>
              <a href="https://whatsapp.com/channel/0029Vb7Z4ExLikg8o9VOjn16" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-gray-500 hover:text-[#25D366] transition-colors">
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a href="mailto:schatsafe@gmail.com" aria-label="Email" className="text-gray-500 hover:text-primary transition-colors">
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-textDark font-semibold mb-4">Job Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-textDark font-semibold mb-4">Jobs by Location</h3>
            <ul className="space-y-2">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    to={`/location/${loc.slug}`}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Jobs in {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-textDark font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <FiMail className="w-4 h-4 text-primary" />
                <a href="mailto:schatsafe@gmail.com" className="text-muted hover:text-primary transition-colors">
                  schatsafe@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <FaInstagram className="w-4 h-4 text-primary" />
                <a
                  href="https://www.instagram.com/jobpulse_24x7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-primary transition-colors"
                >
                  jobpulse_24x7
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <FiMapPin className="w-4 h-4 mt-1 text-primary" />
                <span className="text-muted">Hitech City, Hyderabad, Telangana, India</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/about" className="text-sm text-muted hover:text-primary transition-colors mr-4">
                About Us
              </Link>
              <Link to="/contact" className="text-sm text-muted hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-borderSoft mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted">
            &copy; 2022 JobPulse_24/7. All rights reserved.
          </p>
          <p className="text-sm text-muted mt-2 md:mt-0">
            Made with <span className="text-accent">❤</span> for Indian Job Seekers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
