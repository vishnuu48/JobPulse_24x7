import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import AdminShell from './admin/AdminShell';

const Home = lazy(() => import('./pages/Home'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Categories = lazy(() => import('./pages/Categories'));
const LocationPage = lazy(() => import('./pages/LocationPage'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const MyJobs = lazy(() => import('./pages/MyJobs'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AddJob = lazy(() => import('./admin/AddJob'));
const EditJob = lazy(() => import('./admin/EditJob'));
const ManageJobs = lazy(() => import('./admin/ManageJobs'));
const ManageCategories = lazy(() => import('./admin/ManageCategories'));

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const AdminLayout = ({ children }) => {
  return <AdminShell>{children}</AdminShell>;
};

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col app-shell">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/job/:slug" element={<PublicLayout><JobDetail /></PublicLayout>} />
        <Route path="/categories" element={<PublicLayout><Categories /></PublicLayout>} />
        <Route path="/category/:slug" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/location/:city" element={<PublicLayout><LocationPage /></PublicLayout>} />
        <Route path="/search" element={<PublicLayout><SearchResults /></PublicLayout>} />
        <Route path="/my-jobs" element={<PublicLayout><MyJobs /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<PrivateRoute><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/jobs" element={<PrivateRoute><AdminLayout><ManageJobs /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/jobs/add" element={<PrivateRoute><AdminLayout><AddJob /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/jobs/edit/:id" element={<PrivateRoute><AdminLayout><EditJob /></AdminLayout></PrivateRoute>} />
        <Route path="/admin/categories" element={<PrivateRoute><AdminLayout><ManageCategories /></AdminLayout></PrivateRoute>} />

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </Suspense>
  );
}

export default App;
