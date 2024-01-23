const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const {
  UNAUTHORIZED
} = require("../constants");

const handleValidateToken = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ") && authorizationHeader.split(' ')[1] !== '') {
    const token = authorizationHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decodedPayload) => {
      if (err) {
        throw err;
      } else {
        req.user = decodedPayload.user;
        next();
      }
    });
  } else {
    res.status(UNAUTHORIZED.code);
    res.statusMessage = UNAUTHORIZED.title;
    throw new Error("User is not authorized");
  }
});

module.exports = handleValidateToken;
