const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const profileController = require("../controller/profileController");
const authController = require("../controller/authController");
const { authenticateUser } = require("../middlewares/auth.middleware");

router.route("/").get(userController.getAllUsers);
router.route("/profile").get(authenticateUser, profileController.viewProfile);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

module.exports = router;
