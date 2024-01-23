const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  BAD_REQUEST,
  NOT_FOUND
} = require("../constants");

const login = asyncHandler(async (req, res) => {
  console.log("Requested login body:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(BAD_REQUEST.code);
    res.statusMessage = BAD_REQUEST.title;
    throw new Error("Both username and password required");
  }

  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2m"
      }
    );

    res.status(200).json({
      accessToken
    });
  } else {
    res.status(BAD_REQUEST.code);
    res.statusMessage = BAD_REQUEST.title;
    throw new Error("Wrong username or password");
  }
});

const current = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

const register = asyncHandler(async (req, res) => {
  let hashedPassword = '';
  console.log("Requested register body:", req.body);
  const { username, email, password } = req.body;

  if (password && password.length >= 2) {
    hashedPassword = await bcrypt.hash(password, 10);
  } else {
    hashedPassword = password;
  }

  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });

  if (user) {
    res.status(201).json({
      message: `User ${username} created`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } else {
    res.status(BAD_REQUEST.code);
    res.statusMessage = BAD_REQUEST.title;
    throw new Error("Invalid user details provided");
  }
});

module.exports = {
  login,
  current,
  register
};
