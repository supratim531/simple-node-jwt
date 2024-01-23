const {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR
} = require("../constants");

const handleError = (err, req, res, next) => {
  // console.log("errorHandler.js:", err.name);
  console.log("errorHandler.js:", err);

  switch (err.name) {
    case "TokenExpiredError":
      res.status(FORBIDDEN.code).json({
        status: FORBIDDEN.code,
        title: FORBIDDEN.title,
        message: err.message,
        expiredAt: err?.expiredAt
      });
      break;
    case "JsonWebTokenError":
      res.status(FORBIDDEN.code).json({
        status: FORBIDDEN.code,
        title: FORBIDDEN.title,
        message: err.message
      });
      break;
    case "MongoServerError":
      let duplicateKey = undefined;

      for (let key in err?.keyPattern) {
        duplicateKey = key;
      }

      const duplicateKeyValue = err?.keyValue?.[`${duplicateKey}`];

      if (duplicateKey && duplicateKeyValue) {
        res.status(BAD_REQUEST.code).json({
          status: BAD_REQUEST.code,
          title: BAD_REQUEST.title,
          message: `${duplicateKey} ${duplicateKeyValue} already exists`
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR.code).json({
          status: INTERNAL_SERVER_ERROR.code,
          title: INTERNAL_SERVER_ERROR.title,
          message: err.message
        });
      }
      break;
    case "ValidationError":
      let errors = {};

      for (let key in err.errors) {
        errors[key] = err.errors[key].properties.message;
      }

      res.status(BAD_REQUEST.code).json({
        status: BAD_REQUEST.code,
        title: BAD_REQUEST.title,
        message: errors
      });
      break;
    case "Error":
      let statusCode = res.statusCode;
      let statusMessage = res.statusMessage;

      if (!statusMessage) {
        statusCode = INTERNAL_SERVER_ERROR.code;
        statusMessage = INTERNAL_SERVER_ERROR.title;
      }

      res.status(statusCode).json({
        status: statusCode,
        title: statusMessage,
        message: err.message
      });
      break;
    default:
      res.status(INTERNAL_SERVER_ERROR.code).json({
        status: INTERNAL_SERVER_ERROR.code,
        title: INTERNAL_SERVER_ERROR.title,
        message: err.message
      });
      break;
  }
}

module.exports = handleError;
