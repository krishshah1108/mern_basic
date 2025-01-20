import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailForOtp = async (emailId, otp) => {
  try {
    await transport.sendMail({
      from: `"Chatify Team" <${process.env.EMAIL_USER}>`,
      to: emailId,
      subject: 'OTP for Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to Chatify!</h2>
          <p>We are excited to have you onboard! To complete your email verification, please use the OTP provided below:</p>
          <div style="margin: 20px 0; padding: 10px; text-align: center; font-size: 18px; color: #fff; background-color: #4CAF50; border-radius: 5px;">
            <strong>${otp}</strong>
          </div>
          <p>
            <strong>Please note:</strong>
            <ul>
              <li>This OTP is valid for the next <strong>10 minutes</strong>.</li>
              <li>Do not share this OTP with anyone for security reasons.</li>
            </ul>
          </p>
          <p>If you did not request this verification, please ignore this email or contact our support team.</p>
          <p style="margin-top: 20px; color: #555;">
            Best regards,<br />
            <strong>Chatify Team</strong>
          </p>
        </div>
      `,
    });
    console.log(`OTP email sent successfully to ${emailId}`);
    return true;
  } catch (error) {
    console.error(`Error sending OTP email to ${emailId}:`, error);
    return false;
  }
};

const sendRegistrationSuccessEmail = async (emailId) => {
  try {
    await transport.sendMail({
      from: `"Chatify Team" <${process.env.EMAIL_USER}>`,
      to: emailId,
      subject: 'Registration Success',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to Chatify!</h2>
          <p>Thank you for registering with us. We are excited to have you onboard!</p>
          <p>Best regards,<br />
            <strong>Chatify Team</strong>
          </p>
        </div>
      `,
    });
    console.log(`Registration success email sent successfully to ${emailId}`);
  } catch (error) {
    console.error(`Error sending registration success email to ${emailId}:`, error);
  }
};

const forgotPasswordLink = async (email, link) => {
  try {
    await transport.sendMail({
      from: `"Chatify Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <a href=${link}>Reset Password </a>
          <p>Best regards,<br />
            <strong>Chatify Team</strong>
          </p>
        </div>
      `,
    });
    console.log(`Password reset link sent successfully to ${email}`);
  } catch (error) {
    console.error(`Error sending password reset link to ${email}:`, error);
  }
};
const mailer = {
  sendEmailForOtp,
  sendRegistrationSuccessEmail,
  forgotPasswordLink
};

export default mailer;
