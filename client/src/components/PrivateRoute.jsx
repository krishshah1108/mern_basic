import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (!user) {
      toast.error('Please log in to access this page.');
    }
  }, [user]);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
