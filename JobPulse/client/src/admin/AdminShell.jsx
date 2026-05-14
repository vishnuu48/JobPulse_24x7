import { NavLink, Link } from 'react-router-dom';
import {
  FiBriefcase,
  FiGrid,
  FiHome,
  FiLayout,
  FiLogOut,
  FiPlus
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import ThemeToggle from '../components/ThemeToggle';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiLayout },
  { to: '/admin/jobs', label: 'Jobs', icon: FiBriefcase },
  { to: '/admin/jobs/add', label: 'Add Job', icon: FiPlus },
  { to: '/admin/categories', label: 'Categories', icon: FiGrid }
];

const AdminShell = ({ children }) => {
  const { admin, logout } = useAuth();

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <Link to="/admin/dashboard" className="min-w-0">
              <BrandLogo className="h-11 w-11" textClassName="text-base" wrapperClassName="min-w-0" />
            </Link>
            <span className="hidden rounded-full border border-[rgb(var(--admin-border))] bg-[rgb(var(--admin-card-muted))] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--admin-muted))] sm:inline-flex">
              Admin
            </span>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center justify-between gap-3 xl:justify-end">
            <span className="min-w-0 truncate text-sm text-[rgb(var(--admin-muted))]">
              Welcome, <span className="font-semibold text-[rgb(var(--admin-text))]">{admin?.name || 'Admin'}</span>
            </span>
            <ThemeToggle />
            <Link
              to="/"
              className="admin-icon-button"
              title="View website"
              aria-label="View website"
            >
              <FiHome className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="admin-icon-button text-rose-500 hover:border-rose-300 hover:bg-rose-50"
              title="Logout"
              aria-label="Logout"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AdminShell;
