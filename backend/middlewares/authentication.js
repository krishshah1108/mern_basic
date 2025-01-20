import jwt from 'jsonwebtoken';
import response from '../utils/response_util.js';
import encryptor_util from '../utils/encryptor_util.js';

const isUserAuthenticated = async (req, res, next) => {
  try {
    // const beaerHeader = req.headers.authorization;
    // if (beaerHeader) {
    //   const bearerToken = beaerHeader.split(" ")[1];
    //   const decryptedToken = encryptor_util.decrypt(bearerToken);
    //   jwt.verify(decryptedToken, process.env.JWT_SECRET, (err, decoded) => {
    //     if (err) {
    //       return response.unauthorized(res);
    //     } else {
    //       req.userId = decoded.userId;
    //       next();
    //     }
    //   });
    // } else {
    //   return response.unauthorized(res);
    // }
    const encryptedToken = req.cookies.token;
    if (!encryptedToken) {
      return response.unauthorized(res);
    }
    const decryptedToken = encryptor_util.decrypt(encryptedToken);
    jwt.verify(decryptedToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return response.unauthorized(res);
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return response.failure(error, res);
  }
};

const authentication = {
  isUserAuthenticated,
};

export default authentication;
