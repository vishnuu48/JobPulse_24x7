const BrandLogo = ({
  className = 'w-11 h-11',
  borderClassName = 'border-2',
  shadowClassName = 'shadow-sm',
  alt = 'JobPulse_24x7',
  showText = true,
  textClassName = 'text-sm sm:text-base',
  wrapperClassName = ''
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${wrapperClassName}`}>
      <div
        className={`${className} rounded-full overflow-hidden ${borderClassName} border-accent ${shadowClassName} bg-black flex-shrink-0`}
      >
        <img src="/logo.png" alt={alt} className="w-full h-full object-cover rounded-full" />
      </div>
      {showText && (
        <span className={`${textClassName} font-heading font-bold tracking-normal text-textDark whitespace-nowrap`}>
          JobPulse_24x7
        </span>
      )}
    </div>
  );
};

export default BrandLogo;
