import BrandLogo from './BrandLogo';

const LoadingSpinner = ({ compact = false, label = 'Loading' }) => {
  return (
    <div
      className={compact ? 'flex items-center justify-center py-8' : 'min-h-screen app-shell flex items-center justify-center px-4'}
      role="status"
      aria-live="polite"
      data-no-reveal
    >
      <div className={`modern-loader ${compact ? 'modern-loader-compact' : ''}`}>
        <div className="modern-loader-brand">
          <div className="modern-loader-mark">
            <div className="modern-loader-ring" />
            <div className="modern-loader-ring modern-loader-ring-secondary" />
            <BrandLogo
              className={compact ? 'w-12 h-12' : 'w-20 h-20'}
              borderClassName="border-4"
              shadowClassName="shadow-xl"
              showText={false}
            />
          </div>
          {!compact && (
            <span className="font-heading text-xl font-bold text-textDark">
              JobPulse_24x7
            </span>
          )}
        </div>
        <div className="modern-loader-bar">
          <span />
        </div>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
