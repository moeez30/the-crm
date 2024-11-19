import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import CRMPage from './components/CRM/CRMPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/crm"
            element={
              <PrivateRoute>
                <CRMPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;