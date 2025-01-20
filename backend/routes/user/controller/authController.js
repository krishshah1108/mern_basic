import models from "../../../models/zindex.js";
import response from "../../../utils/response_util.js";
import encryptor_util from "../../../utils/encryptor_util.js";
import jwt from "jsonwebtoken";
import helper_util from "../../../utils/helper_util.js";
import mailer_util from "../../../utils/mailer_util.js";

const registerAndSendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return response.validationErr("All fields are required", res);
    }
    const userModel = models.User;
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      if (req.publicId) {
        await helper_util.deleteFromCloudinary(req.publicId);
      }
      return response.badRequest("User already exists", res);
    }
    const encryptedPassword = encryptor_util.encrypt(password);

    const otpModel = models.Otp;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const data = {
      name,
      email,
      password: encryptedPassword,
      profile: req.fileUrl,
    };
    const existingOtpData = await otpModel.findOne({ email });
    if (existingOtpData) {
      await otpModel.deleteOne({ email });
    }
    const newOtp = new otpModel({
      email,
      otp,
      data,
      expiresAt,
    });
    await newOtp.save();
    const otpSent = await mailer_util.sendEmailForOtp(email, otp);
    if (!otpSent) {
      return response.failure("Failed to send OTP", res);
    }
    return response.success("OTP sent successfully", { emailId: email }, res);
  } catch (error) {
    if (req.publicId) {
      await helper_util.deleteFromCloudinary(req.publicId);
    }
    console.log(error);
    return response.failure(error, res);
  }
};

const resendOtpForRegistration = async (req, res) => {
  const { emailId } = req.body;
  const otpModel = models.Otp;
  const otpExist = await otpModel.findOne({ email: emailId }).lean();
  if (!otpExist) {
    return response.badRequest("Please try again completely!", res);
  }
  const newOtp = Math.floor(1000 + Math.random() * 9000);
  const newData = {
    email: emailId,
    data: otpExist.data,
    otp: newOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  };
  await otpModel.deleteOne({ email: emailId });
  const newOtpData = new otpModel(newData);
  await newOtpData.save();
  const otpSent = await mailer_util.sendEmailForOtp(emailId, newOtp);
  if (!otpSent) {
    return response.failure("Failed to send OTP", res);
  }
  return response.success("OTP sent successfully", { emailId: emailId }, res);
};
const verifyOtpAndRegister = async (req, res) => {
  const { emailId, otp } = req.body;
  if (!emailId || !otp) {
    return response.validationErr("All fields are required", res);
  }
  const otpModel = models.Otp;
  const otpExist = await otpModel.findOne({ email: emailId }).lean();
  if (
    !otpExist ||
    otpExist.otp !== otp ||
    new Date(otpExist.expiresAt) < new Date(Date.now())
  ) {
    return response.badRequest("Invalid or expire OTP please try again", res);
  }
  const userModel = models.User;
  const { name, email, password, profile } = otpExist.data;
  await userModel.create({ name, email, password, profile });
  await otpModel.deleteOne({ email });
  mailer_util.sendRegistrationSuccessEmail(emailId);
  return response.created("User registered Successfully!", 1, res);
};


const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return response.validationErr("All fields are required", res);
    }
    const userModel = models.User;
    const userFound = await userModel.findOne({ email });
    if (!userFound) {
      return response.unauthorized("Invalid password or email", res);
    }
    const decryptedPassword = encryptor_util.decrypt(userFound.password);
    if (decryptedPassword !== password) {
      return response.unauthorized("Invalid password or email", res);
    }
    const token = jwt.sign({ userId: userFound._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const encryptedToken = encryptor_util.encrypt(token);
    const user = {
      _id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      token: encryptedToken,
    };
    res.cookie("token", encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return response.success("User logged in successfully", user, res);
  } catch (error) {
    console.log(error);
    return response.failure(error, res);
  }
};

const forgotPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return response.validationErr("All fields are required", res);
    }

    const userModel = models.User;
    const userFound = await userModel.findOne({ email });

    if (!userFound) {
      return response.success(
        "Password reset link sent successfully, if the email exists",
        1,
        res
      );
    }

    const token = jwt.sign(
      { email: userFound.email },
      process.env.RESET_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const resetLink = `${process.env.CLIENT_BASE_URL}/reset-password/?email=${email}&token=${token}`;

    await mailer_util.forgotPasswordLink(email, resetLink);

    return response.success(
      "Password reset link sent successfully, if the email exists",
      1,
      res
    );
  } catch (error) {
    console.error(error);
    return response.failure(error, res);
  }
};

const validateTokenAndResetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return response.validationErr("All fields are required", res);
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.RESET_SECRET);
    } catch (err) {
      return response.unauthorized("Invalid or expired token", res);
    }

    if (decodedToken.email !== email) {
      return response.unauthorized("Invalid token for this email", res);
    }

    const userModel = models.User;
    const userFound = await userModel.findOne({ email });

    if (!userFound) {
      return response.badRequest("User not found", res);
    }

    const encryptedPassword = encryptor_util.encrypt(password);

    userFound.password = encryptedPassword;
    await userFound.save();

    return response.success("Password reset successfully", 1, res);
  } catch (error) {
    console.error(error);
    return response.failure(
      "An error occurred while processing your request",
      res
    );
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return response.success("User logged out successfully", 1, res);
  } catch (error) {
    console.log(error);
    return response.failure(error, res);
  }
};

const authController = {
  registerAndSendOtp,
  resendOtpForRegistration,
  verifyOtpAndRegister,
  forgotPasswordLink,
  validateTokenAndResetPassword,
  userLogin,
  logout,
};

export default authController;
