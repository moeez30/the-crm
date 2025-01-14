import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/Auth/AuthPage';
import CRMPage from './components/CRM/CRMPage';
import AdminDashboard from './pages/AdminDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AuthPage />} />
          
          {/* Protected User Routes */}
          <Route 
            path="/crm" 
            element={
              <ProtectedRoute>
                <CRMPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin-Only Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ ProtectedRoute>
            } 
          />

          {/* Unauthorized Access Route */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;