import axios from 'axios';
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const registerAndSendOtp = async (formData) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/user/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

const verifyOtpAndRegister = async ({ emailId, otp }) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/user/verifyOtp`, {
      emailId,
      otp,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

const resendOtpForRegistration = async ({ emailId }) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/user/resendOtp`, {
      emailId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

const userLogin = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/user/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

const forgotPasswordLink = async ({ email }) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/user/forgot-password`, { email });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

const validateTokenAndResetPassword = async ({ email, token, password }) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/user/reset-password`, {
      email,
      token,
      password,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

const logout = async () => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/user/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};

const authApi = {
  registerAndSendOtp,
  verifyOtpAndRegister,
  resendOtpForRegistration,
  userLogin,
  forgotPasswordLink,
  validateTokenAndResetPassword,
  logout,
};

export default authApi;
