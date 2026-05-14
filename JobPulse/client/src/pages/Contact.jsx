import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { contactApi } from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactApi.sendMessage(formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send your message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: 'schatsafe@gmail.com', href: 'mailto:schatsafe@gmail.com' },
    { icon: FaInstagram, label: 'Instagram', value: 'jobpulse_24x7', href: 'https://www.instagram.com/jobpulse_24x7/' },
    { icon: FiMapPin, label: 'Address', value: 'Hitech City, Hyderabad, Telangana, India' }
  ];

  const socialLinks = [
    { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/jobpulse_24x7/', color: '#E4405F' },
    { icon: FaTelegram, label: 'Telegram', href: 'https://t.me/jobpulse_24x7', color: '#0088cc' },
    { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://whatsapp.com/channel/0029Vb7Z4ExLikg8o9VOjn16', color: '#25D366' },
    { icon: FiMail, label: 'Gmail', href: 'mailto:schatsafe@gmail.com', color: '#EA4335' }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - JobPulse_24x7 | Get in Touch</title>
        <meta name="description" content="Contact JobPulse_24x7 for any queries, feedback, or support. We're here to help you find your dream job." />
      </Helmet>

      <div className="section-muted border-b border-borderSoft py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-textDark"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-muted">
              We'd love to hear from you. Get in touch with us.
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-textDark mb-6">Get in Touch</h2>
              <p className="text-muted mb-8">
                Have questions about job listings, need help with your job search, or want to 
                collaborate with us? Fill out the form and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-textDark">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-muted hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p className="font-medium text-textDark mb-4">Follow us on social media</p>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: `${social.color}15`, color: social.color }}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="surface-card p-8">
                <h3 className="text-xl font-bold text-textDark mb-6">Send us a message</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="input-field resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
