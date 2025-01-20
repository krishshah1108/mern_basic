let statusCode = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
};

const responses = {
  success: (message, data, res) => {
    return res.status(statusCode.SUCCESS).json({
      status: statusCode.SUCCESS,
      message: message || 'Your request is successfully executed',
      result: data,
      success: true,
    });
  },

  created: (message, data, res) => {
    return res.status(statusCode.CREATED).json({
      status: statusCode.CREATED,
      message: message || 'Your request is successfully executed',
      result: data,
      success: true,
    });
  },

  badRequest: (message, res) => {
    return res.status(statusCode.BAD_REQUEST).json({
      status: statusCode.BAD_REQUEST,
      message: message || 'Your request failed!',
      success: false,
    });
  },

  unauthorized: (message, res) => {
    return res.status(statusCode.UNAUTHORIZED).json({
      status: statusCode.UNAUTHORIZED,
      message: message || 'Unauthorized User ! Access denied!',
      success: false,
    });
  },

  forbidden: (message, res) => {
    return res.status(statusCode.FORBIDDEN).json({
      status: statusCode.FORBIDDEN,
      message: message || 'Forbidden User ! Access denied!',
      success: false,
    });
  },

  notFound: (message, res) => {
    return res.status(statusCode.NOT_FOUND).json({
      status: statusCode.NOT_FOUND,
      message: message || 'Resource not found!',
      success: false,
    });
  },

  validationErr: (message, res) => {
    return res.status(statusCode.VALIDATION_ERROR).json({
      status: statusCode.VALIDATION_ERROR,
      message: message || 'Validation Error!',
      success: false,
    });
  },

  failure: (message, res) => {
    return res.status(statusCode.SERVER_ERROR).json({
      status: statusCode.SERVER_ERROR,
      message: message || 'Internal Server Error!',
      success: false,
    });
  },
};

export default responses;
