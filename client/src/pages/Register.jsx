import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const Register = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timer, setTimer] = useState(30);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [emailForRegister, setEmailForRegister] = useState('');

  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const formData = new FormData(e.target);
      const response = await authApi.registerAndSendOtp(formData);
      if (response.success) {
        dispatch(setLoading(false));
        dispatch(setError(null));
        const emailId = response.data?.result?.emailId;
        setEmailForRegister(emailId);
        toast.success(response.data.message);
        setIsModalOpen(true);
      } else {
        setEmailForRegister('');
        setSelectedImage(null);
        dispatch(setLoading(false));
        dispatch(setError(response.error));
        toast.error(response.error);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while registering.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpRefs.map((ref) => ref.current.value).join('');
    if (otp.length !== 4) {
      toast.error('Please enter the complete OTP.');
      return;
    }
    try {
      dispatch(setLoading(true));
      const response = await authApi.verifyOtpAndRegister({
        emailId: emailForRegister,
        otp,
      });

      if (response.success) {
        dispatch(setLoading(false));
        dispatch(setError(null));
        toast.success(response.data.message);
        navigate('/login');
        setIsModalOpen(false);
      } else {
        dispatch(setLoading(false));
        dispatch(setError(response.error));
        otpRefs.map((ref) => (ref.current.value = ''));
        toast.error(response.error);
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while verifying OTP.');
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageError('Please select file.');
      setSelectedImage(null);
      return;
    }
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setImageError('Only PNG and JPEG images are allowed.');
        setSelectedImage(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError('File size must be less than 5 MB.');
        setSelectedImage(null);
        return;
      }
      setImageError('');
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleOtpInput = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      if (index < otpRefs.length - 1) {
        otpRefs[index + 1].current.focus();
      }
    } else {
      e.target.value = '';
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleResendOtp = async () => {
    setTimer(30);
    otpRefs.map((ref) => (ref.current.value = ''));
    try {
      const response = await authApi.resendOtpForRegistration({
        emailId: emailForRegister,
      });
      if (response.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while resending OTP.');
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (isModalOpen) {
      otpRefs[0].current.focus();
    }
  }, [isModalOpen]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative flex flex-col items-center bg-transparent p-6 rounded-lg">
            <Loading />
          </div>
        </div>
      )}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Register</h2>
          <form onSubmit={handleRegister}>
            {}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="profile">
                Profile Picture
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                id="profile"
                name="profile"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
              {selectedImage && (
                <div className="mt-4">
                  <p className="text-gray-700 text-sm">Image Preview:</p>
                  <img
                    src={selectedImage}
                    alt="Selected Profile"
                    className="mt-2 rounded-lg shadow w-32 h-32 object-cover"
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Register
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Enter OTP</h2>
            <p className="text-center text-gray-600 mb-4">
              A 4-digit verification code has been sent to your email.
            </p>
            <div className="flex justify-center space-x-2 mb-4">
              {otpRefs.map((ref, index) => (
                <input
                  key={index}
                  type="text"
                  name="otp"
                  maxLength="1"
                  ref={ref}
                  onChange={(e) => handleOtpInput(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  className="w-12 h-12 text-center text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ))}
            </div>
            <div className="text-center mt-4">
              {timer > 0 ? (
                <span className="text-gray-600 text-sm">Resend OTP in {timer}s</span>
              ) : (
                <Link
                  onClick={handleResendOtp}
                  className="text-blue-600 text-sm font-semibold hover:underline"
                >
                  Resend OTP
                </Link>
              )}
            </div>
            <button
              type="submit"
              onClick={handleVerifyOtp}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 mt-4"
            >
              Verify OTP
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
