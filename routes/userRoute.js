const express = require("express");
const router = express.Router();
const handleValidateToken = require("../middlewares/validateTokenHandler");
const {
  login,
  current,
  register
} = require("../controllers/userController");

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/current").get(handleValidateToken, current);

module.exports = router;
