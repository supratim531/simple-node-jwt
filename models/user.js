const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [2, "Username must have at least 2 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [2, "Password must have at least 2 characters"]
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
