import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';
import SearchSuggestions from './SearchSuggestions';

const categories = [
  { name: 'IT Jobs', slug: 'it-jobs' },
  { name: 'BPO Jobs', slug: 'bpo-jobs' },
  { name: 'Bank Jobs', slug: 'bank-jobs' },
  { name: 'Work From Home', slug: 'work-from-home' },
  { name: 'Fresher Jobs', slug: 'fresher-jobs' },
  { name: 'Walk-In Jobs', slug: 'walk-in-jobs' }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`;
  const categoriesActive = pathname === '/categories' || pathname.startsWith('/category/');

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    navigate(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : '/search');
    setSearchQuery('');
    setIsOpen(false);
    setShowSearchSuggestions(false);
  };

  const handleSuggestionSelect = (recommendation) => {
    navigate(`/search?q=${encodeURIComponent(recommendation)}`);
    setSearchQuery('');
    setIsOpen(false);
    setShowSearchSuggestions(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-borderSoft bg-card/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex min-w-0 items-center space-x-3">
            <BrandLogo textClassName="text-xs sm:text-base" wrapperClassName="min-w-0" />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <div className="relative group">
              <NavLink to="/categories" className={`nav-link ${categoriesActive ? 'nav-link-active' : ''}`}>
                Categories
              </NavLink>
              <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-borderSoft">
                <div className="py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-muted hover:bg-surfaceMuted hover:text-primary"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/my-jobs" className={navLinkClass}>
              My Jobs
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setShowSearchSuggestions(false)}
                placeholder="Search jobs..."
                className="w-64 pl-10 pr-4 py-2 bg-background border border-borderSoft rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-textDark placeholder-muted"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <SearchSuggestions
                query={searchQuery}
                visible={showSearchSuggestions}
                onSelect={handleSuggestionSelect}
              />
            </div>
            </form>
            <ThemeToggle />
          </div>

          <button
            className="md:hidden p-2 text-muted hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto bg-card border-t border-borderSoft"
          >
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearchSuggestions(true)}
                      onBlur={() => setShowSearchSuggestions(false)}
                      placeholder="Search jobs..."
                      className="w-full pl-10 pr-4 py-3 bg-background border border-borderSoft rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-textDark placeholder-muted"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <SearchSuggestions
                      query={searchQuery}
                      visible={showSearchSuggestions}
                      onSelect={handleSuggestionSelect}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90"
                  >
                    <FiSearch className="h-4 w-4" />
                    <span>Search</span>
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between rounded-lg border border-borderSoft bg-background px-3 py-2">
                <span className="text-sm font-medium text-muted">Theme</span>
                <ThemeToggle />
              </div>

              <NavLink
                to="/"
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block rounded-lg px-3 py-2 font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surfaceMuted hover:text-primary'
                }`}
              >
                Home
              </NavLink>
              
              <div className="py-2">
                <NavLink
                  to="/categories"
                  onClick={() => setIsOpen(false)}
                  className={`mb-2 block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    categoriesActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surfaceMuted hover:text-primary'
                  }`}
                >
                  Categories
                </NavLink>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg border border-borderSoft bg-background px-3 py-2 text-sm text-muted hover:border-primary/40 hover:text-primary"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <NavLink
                to="/about"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block rounded-lg px-3 py-2 font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surfaceMuted hover:text-primary'
                }`}
              >
                About
              </NavLink>
              <NavLink
                to="/my-jobs"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block rounded-lg px-3 py-2 font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surfaceMuted hover:text-primary'
                }`}
              >
                My Jobs
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block rounded-lg px-3 py-2 font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surfaceMuted hover:text-primary'
                }`}
              >
                Contact
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
