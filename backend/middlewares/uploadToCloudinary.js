import cloudinary from '../config/cloudinary.config.js';
import respose from '../utils/response_util.js';
import fs from 'fs';

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return respose.validationErr('Profile picture is required', res);
    }
    const filePath = req.file.path;
    if (req.isValidImage) {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: 'basic_users',
      });
      fs.unlinkSync(filePath);
      req.fileUrl = uploadResult.secure_url;
      req.publicId = uploadResult.public_id;
      next();
    }
  } catch (error) {
    console.log(error);
    return respose.failure(error, res);
  }
};

export default uploadToCloudinary;
