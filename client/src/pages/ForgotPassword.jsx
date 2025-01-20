import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authApi from '../features/auth/authApi';
import { setLoading } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const response = await authApi.forgotPasswordLink({ email });
    dispatch(setLoading(false));

    if (response.success) {
      toast.success(response.data.message);
      setMessage(
        `Password reset link sent to ${email}. Please check your email and reset your password.`
      );
      setEmail('');
      setRedirect(true);
    } else {
      toast.error(response.error);
    }
  };

  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [redirect, navigate]);

  if (loading) return <Loading />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        {message && (
          <div className="mb-4 text-green-600 text-center">
            {message}
            <br />
            <span className="text-blue-600 font-medium">Redirecting to login page...</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
