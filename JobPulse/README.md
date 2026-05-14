# JobsHunt - MERN Stack Job Portal

A full-stack job portal website similar to FoundTheJob.com and KickCharm.com - an Indian job aggregator platform targeting freshers.

## Tech Stack

- **Frontend**: React.js (Vite), TailwindCSS, React Query, React Router, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT

## Features

- Browse jobs by category, location, and qualification
- Advanced search and filters
- SEO optimized with meta tags and JSON-LD
- Mobile responsive design
- Admin panel for job management
- Rich text editor for job descriptions
- Social sharing buttons

## Prerequisites

- Node.js >= 18
- MongoDB running locally or MongoDB Atlas
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

Update the `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/jobshunt
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- 10 job categories
- 20 sample jobs
- Admin user: `admin@jobshunt.com` / `admin123`

### 4. Run the Application

```bash
# Run both server and client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:5173/admin

## Project Structure

```
jobshunt/
├── client/                  # React frontend
│   ├── src/
│   │   ├── admin/          # Admin panel components
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context (Auth)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utilities (API)
├── server/
│   ├── config/             # Database config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── seed.js             # Database seeder
│   └── server.js           # Express server
├── .env                    # Environment variables
└── package.json            # Root package.json
```

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:slug` - Get single job
- `GET /api/jobs/featured` - Get featured jobs
- `GET /api/jobs/latest` - Get latest jobs
- `GET /api/jobs/search` - Search jobs
- `POST /api/jobs` - Create job (admin)
- `PUT /api/jobs/:id` - Update job (admin)
- `DELETE /api/jobs/:id` - Delete job (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Auth
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

### SEO
- `GET /sitemap.xml` - Dynamic sitemap
- `GET /robots.txt` - Robots file

## Admin Panel

Access the admin panel at `/admin` with credentials:
- Email: admin@jobshunt.com
- Password: admin123

Features:
- Dashboard with stats
- Add/Edit/Delete jobs
- Rich text editor for descriptions
- Toggle job active status
- Manage categories

## License

MIT
