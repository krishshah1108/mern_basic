import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authApi from '../features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUser } from '../features/auth/authSlice';
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const handleLogout = async () => {
    try {
      const response = await authApi.logout();
      if (response.success) {
        toast.success(response.data.message);
        dispatch(setUser(null));
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while logging out.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome {user?.name}</h1>
        <p className="text-gray-600 mb-6">
          Explore your dashboard and manage your tasks effectively.
        </p>
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
