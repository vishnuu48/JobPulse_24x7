const getApiOrigin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  try {
    const parsed = new URL(apiUrl);
    return parsed.pathname.endsWith('/api')
      ? `${parsed.origin}${parsed.pathname.replace(/\/api\/?$/, '')}`
      : parsed.origin;
  } catch {
    return 'http://localhost:5000';
  }
};

export const getMediaUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads/')) return `${getApiOrigin()}${url}`;
  return url;
};
