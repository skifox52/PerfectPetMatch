// src/components/ProtectedRoute.tsx
import { Route, Navigate } from 'react-router-dom';

function isAuthenticated(): boolean {
  const userData = localStorage.getItem('User');
  if (userData == null) return false;
  const role = JSON.parse(localStorage.getItem('User')!).role;
  return role === 'admin';
}

// Component for protected routes
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
