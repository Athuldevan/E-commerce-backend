const express = require("express");
const checkOutController = require("../controller/checkoutController");
const { authenticateUser } = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/").get(authenticateUser, checkOutController.getCheckoutSummary);

module.exports = router;
