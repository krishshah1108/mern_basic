import React, { useState } from "react";
import authApi from "../features/auth/authApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../features/auth/authSlice";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.userLogin(data);
      if (response.success) {
        toast.success(response.data.message);
        dispatch(setError(null));
        dispatch(setLoading(false));
        dispatch(setUser(response.data.result));
        navigate("/dashboard");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while logging in.");
    }
  };
  return (
    <>
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
          <h2 className='text-2xl font-bold text-gray-800 text-center mb-6'>
            Login
          </h2>
          <form onSubmit={handleLoginSubmit}>
            <div className='mb-4'>
              <label className='block text-gray-700 mb-2' htmlFor='email'>
                Email
              </label>
              <input
                type='text'
                id='email'
                value={data.email}
                onChange={onInputChange}
                name='email'
                placeholder='Enter your email'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 mb-2' htmlFor='password'>
                Password
              </label>
              <input
                type='password'
                id='password'
                value={data.password}
                onChange={onInputChange}
                name='password'
                placeholder='Enter your password'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700'
            >
              Login
            </button>
          </form>
          <p className='text-center text-gray-600 mt-4'>
            Don't have an account?{" "}
            <Link to='/register' className='text-blue-600 hover:underline'>
              Register
            </Link>
          </p>
          <p className='text-center text-gray-600 mt-4'>
            <Link
              to='/forgot-password'
              className='text-blue-600 hover:underline'
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
