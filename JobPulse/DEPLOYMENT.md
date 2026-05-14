# JobPulse_24x7 Deployment

This project is ready for a single Render Web Service deployment.

## Production Shape

- Render runs the Node/Express server from `server/server.js`.
- The build step compiles the React app into `client/dist`.
- In production, Express serves `client/dist` and keeps all API routes under `/api`.
- The frontend uses `/api` by default in production, so no separate frontend URL is required.

## Render Setup

1. Push this project to a GitHub repository.
2. In Render, create a new Blueprint from the repository.
3. Render will read `render.yaml` from the repository root.
4. Fill the secret environment variables when Render asks.
5. Deploy.

## Page Reloads And Direct Links

This repo is configured to avoid the common React Router refresh problem:

- Deploy with `render.yaml` as a single Render Web Service.
- Express serves `client/dist` in production.
- Any browser page route such as `/about`, `/contact`, `/job/example`, or `/admin` falls back to `client/dist/index.html`.
- API routes under `/api` still return API responses, not the React app.

If you ever deploy the React client separately as a Render Static Site, add this Render rewrite rule:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

Do not use Redirect for this rule. It must be a Rewrite so the browser keeps the original URL and React Router renders the matching page.

## Required Environment Variables

Set these in Render:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PUBLIC_SITE_URL=https://your-render-url.onrender.com
PUBLIC_API_URL=https://your-render-url.onrender.com
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_channel_or_group_id
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
SMTP_PASS=your_gmail_app_password
```

These are already defined in `render.yaml`:

```env
NODE_ENV=production
IMAGE_STORAGE_PROVIDER=cloudinary
CLOUDINARY_FOLDER=jobpulse/jobs
CONTACT_MAIL_TO=schatsafe@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=schatsafe@gmail.com
SMTP_FROM=JobPulse_24x7 <schatsafe@gmail.com>
```

`JWT_SECRET` is generated automatically by Render.

## Build And Start Commands

```bash
npm run render-build
npm start
```

## Important Upload Note

Admin job images are uploaded to Cloudinary in production. Add `CLOUDINARY_URL` in Render before using the admin image uploader.

For local development without Cloudinary, leave `IMAGE_STORAGE_PROVIDER` unset or set it to `local`. Local fallback uploads are stored under `server/uploads`.
