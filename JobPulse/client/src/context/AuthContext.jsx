import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);

const isValidAdmin = (admin) => (
  admin
  && typeof admin === 'object'
  && typeof admin._id === 'string'
  && typeof admin.email === 'string'
);

const readStoredAdmin = () => {
  try {
    const storedAdmin = localStorage.getItem('adminUser');
    if (!storedAdmin) return null;

    const parsedAdmin = JSON.parse(storedAdmin);
    return isValidAdmin(parsedAdmin) ? parsedAdmin : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const storedAdmin = readStoredAdmin();
    
    if (token && storedAdmin) {
      setAdmin(storedAdmin);
      verifyToken();
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await authApi.getMe();
      const adminData = response.data?.data;

      if (!response.data?.success || !isValidAdmin(adminData)) {
        throw new Error('Invalid admin profile payload');
      }

      setAdmin(adminData);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { token, ...adminData } = response.data?.data || {};

    if (!response.data?.success || !token || !isValidAdmin(adminData)) {
      throw new Error('Invalid admin login payload');
    }
    
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
    setAdmin(adminData);
    
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
