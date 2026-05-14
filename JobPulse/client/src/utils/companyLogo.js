export const getCompanyInitial = (company) => {
  return company?.trim()?.charAt(0)?.toUpperCase() || 'J';
};

export const shouldUseCompanyLogo = (logoUrl) => {
  if (!logoUrl) return false;

  try {
    const url = new URL(logoUrl);
    return url.hostname !== 'logo.clearbit.com';
  } catch {
    return false;
  }
};
