import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();
  const Icon = isDark ? FiSun : FiMoon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-borderSoft bg-card text-muted transition-all hover:border-primary/40 hover:text-primary hover:shadow-sm ${className}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};

export default ThemeToggle;
