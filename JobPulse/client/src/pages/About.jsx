import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiBriefcase, FiHeart, FiTarget, FiUsers } from 'react-icons/fi';
import { FaTelegram, FaWhatsapp } from 'react-icons/fa';
import BrandLogo from '../components/BrandLogo';
import { publicMetrics } from '../utils/siteMetrics';

const About = () => {
  const communityLinks = [
    {
      icon: FaWhatsapp,
      label: 'WhatsApp Channel',
      href: 'https://whatsapp.com/channel/0029Vb7Z4ExLikg8o9VOjn16',
      className: 'border-[#25D366]/35 bg-[#25D366]/10 text-[#128C4A] hover:bg-[#25D366]/15 dark:text-[#6EE7A8]'
    },
    {
      icon: FaTelegram,
      label: 'Telegram Channel',
      href: 'https://t.me/jobpulse_24x7',
      className: 'border-[#0088cc]/35 bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/15 dark:text-[#7DD3FC]'
    }
  ];

  const features = [
    {
      icon: FiBriefcase,
      title: 'Extensive Job Database',
      description: 'Access thousands of job listings from top companies across India, updated daily.'
    },
    {
      icon: FiUsers,
      title: 'Fresher Focused',
      description: 'We specialize in entry-level positions and opportunities for fresh graduates.'
    },
    {
      icon: FiTarget,
      title: 'Accurate Listings',
      description: 'All jobs are verified and link directly to the official company career pages.'
    },
    {
      icon: FiHeart,
      title: 'Free Forever',
      description: 'JobPulse_24/7 is completely free for job seekers. No hidden charges.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - JobPulse_24/7 | India's Leading Job Portal for Freshers</title>
        <meta name="description" content="Learn about JobPulse_24/7 - India's leading job aggregator platform for freshers. We help fresh graduates find their dream jobs at top companies." />
      </Helmet>

      <div className="section-muted border-b border-borderSoft py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-textDark"
          >
            <div className="flex justify-center mb-6">
              <BrandLogo
                className="w-20 h-20"
                borderClassName="border-4"
                shadowClassName="shadow-lg"
                textClassName="text-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              About Job<span className="text-primary">Pulse</span>_24/7
            </h1>
            <p className="text-xl text-muted">
              Your Career Awaits!
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-textDark mb-6">Our Mission</h2>
              <p className="text-muted mb-4 leading-relaxed">
                At JobPulse_24/7, we believe every fresh graduate deserves access to quality job opportunities. 
                Our mission is to bridge the gap between talented freshers and India's top employers.
              </p>
              <p className="text-muted mb-4 leading-relaxed">
                We aggregate job listings from hundreds of companies including TCS, Infosys, Wipro, Amazon, 
                Flipkart, and many more. Our platform makes it easy for freshers to find and apply for 
                positions that match their skills and aspirations.
              </p>
              <p className="text-muted leading-relaxed">
                Unlike other job portals, we don't require registration. Simply browse, find a job you like, 
                and apply directly on the company's career page. It's that simple.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="surface-card p-8"
            >
              <div className="grid grid-cols-2 gap-6">
                {publicMetrics.map((metric) => (
                  <div key={metric.label} className="text-center">
                    <p className="text-4xl font-bold text-primary">{metric.value}</p>
                    <p className="text-muted">{metric.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 section-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-textDark text-center mb-12">
            Why Choose JobPulse_24/7?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="surface-card p-6 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-textDark mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="surface-card p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-muted mb-6 max-w-2xl mx-auto">
              Follow us on social media for daily job updates, career tips, and interview preparation guides.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {communityLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg ${link.className}`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
