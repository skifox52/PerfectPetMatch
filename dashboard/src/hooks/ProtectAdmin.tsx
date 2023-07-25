import { Navigate, Outlet, RouterProps } from 'react-router-dom';
import React from 'react';

const isAdmin = (role: string): boolean => {
  return role.toLocaleLowerCase() === 'Admin';
};

interface ProtectAdminInterface extends RouterProps {
  role: string | null;
}

export const ProtectAdmin: React.FC<ProtectAdminInterface> = ({ role }) => {
  if (role === null) return <Navigate to={'http://localhost:5173/login'} />;
  return isAdmin(role) ? (
    <Outlet />
  ) : (
    <Navigate to={'http://localhost:5173/login'} />
  );
};
