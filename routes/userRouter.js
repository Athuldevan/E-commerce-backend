const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const profileController = require("../controller/profileController");
const { authenticateUser } = require("../middlewares/auth.middleware");

router.route("/").get(userController.getAllUsers);

router.route("/profile").get(authenticateUser, profileController.viewProfile);

module.exports = router;
