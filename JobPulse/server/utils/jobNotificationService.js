const DEFAULT_SITE_URL = 'http://localhost:5173';
const fs = require('fs');
const path = require('path');

const stripHtml = (html = '') => {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
};

const truncate = (text = '', maxLength = 900) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
};

const getPublicSiteUrl = () => {
  return (
    process.env.PUBLIC_SITE_URL ||
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    DEFAULT_SITE_URL
  ).replace(/\/$/, '');
};

const getPublicApiUrl = () => {
  return (
    process.env.PUBLIC_API_URL ||
    process.env.SERVER_URL ||
    process.env.API_URL ||
    'http://localhost:5000'
  ).replace(/\/$/, '');
};

const isPublicImageUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const toPublicAssetUrl = (url) => {
  if (!url) return '';
  if (isPublicImageUrl(url)) return url;
  if (url.startsWith('/uploads/')) return `${getPublicApiUrl()}${url}`;
  return '';
};

const getJobImageUrl = (job) => {
  return toPublicAssetUrl(job.jobImage) || toPublicAssetUrl(job.companyLogo);
};

const getLocalUploadPath = (url) => {
  if (!url || !url.startsWith('/uploads/')) return '';

  const filePath = path.normalize(path.join(__dirname, '..', url));
  const uploadsRoot = path.normalize(path.join(__dirname, '..', 'uploads'));

  if (!filePath.startsWith(uploadsRoot)) return '';
  return fs.existsSync(filePath) ? filePath : '';
};

const buildJobUrl = (job) => {
  return `${getPublicSiteUrl()}/job/${job.slug}`;
};

const buildJobMessage = (job, { maxDescriptionLength = 520 } = {}) => {
  const description = truncate(stripHtml(job.description), maxDescriptionLength);
  const location = Array.isArray(job.location) ? job.location.join(', ') : job.location;
  const qualification = Array.isArray(job.qualification) ? job.qualification.join(', ') : job.qualification;
  const categoryName = job.category?.name || '';
  const jobUrl = buildJobUrl(job);

  return [
    '🚀 New Job Alert | JobPulse_24x7',
    '',
    `💼 ${job.title}`,
    `🏢 ${job.company}`,
    categoryName ? `📌 Category: ${categoryName}` : '',
    location ? `📍 Location: ${location}` : '',
    job.experience ? `🧑‍💻 Experience: ${job.experience}` : '',
    job.jobType ? `🕒 Type: ${job.jobType}` : '',
    qualification ? `🎓 Qualification: ${qualification}` : '',
    job.salary ? `💰 Salary: ${job.salary}` : '',
    '',
    description ? `📝 ${description}` : '',
    '',
    `🔗 Apply: ${job.applyLink}`,
    `🌐 View Details: ${jobUrl}`
  ].filter(Boolean).join('\n');
};

const postJson = async (url, body, headers = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(body)
  });

  const responseText = await response.text();
  let responseBody = responseText;
  try {
    responseBody = responseText ? JSON.parse(responseText) : {};
  } catch {
    // Keep text body for diagnostics.
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(responseBody)}`);
  }

  return responseBody;
};

const postFormData = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    body
  });

  const responseText = await response.text();
  let responseBody = responseText;
  try {
    responseBody = responseText ? JSON.parse(responseText) : {};
  } catch {
    // Keep text body for diagnostics.
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(responseBody)}`);
  }

  return responseBody;
};

const sendTelegramJobPost = async (job) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return { skipped: true, reason: 'Telegram env not configured' };
  }

  const localImagePath = getLocalUploadPath(job.jobImage);
  const imageUrl = localImagePath ? '' : getJobImageUrl(job);
  const hasImage = Boolean(localImagePath || imageUrl);
  const message = buildJobMessage(job, { maxDescriptionLength: hasImage ? 420 : 1600 });
  const endpoint = hasImage ? 'sendPhoto' : 'sendMessage';
  const url = `https://api.telegram.org/bot${botToken}/${endpoint}`;

  if (localImagePath) {
    const body = new FormData();
    const imageBlob = await fs.openAsBlob(localImagePath);
    body.append('chat_id', chatId);
    body.append('photo', imageBlob, path.basename(localImagePath));
    body.append('caption', truncate(message, 1000));
    body.append('parse_mode', 'HTML');

    await postFormData(url, body);
    return { skipped: false };
  }

  const body = imageUrl
    ? {
      chat_id: chatId,
      photo: imageUrl,
      caption: truncate(message, 1000),
      parse_mode: 'HTML'
    }
    : {
      chat_id: chatId,
      text: truncate(message, 3800),
      disable_web_page_preview: false
    };

  await postJson(url, body);
  return { skipped: false };
};

const notifyJobPosted = async (job) => {
  try {
    const result = await sendTelegramJobPost(job);
    return [{ status: 'fulfilled', value: result }];
  } catch (error) {
    console.error('Telegram job notification failed:', error.message);
    return [{ status: 'rejected', reason: error }];
  }
};

module.exports = {
  buildJobMessage,
  getJobImageUrl,
  notifyJobPosted
};
