import cloudinary from '../config/cloudinary.config.js';
import respose from '../utils/response_util.js';

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    return respose.failure(error, res);
  }
};

const helper_util = {
  deleteFromCloudinary,
};

export default helper_util;
