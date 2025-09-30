const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

const { authenticateUser } = require("../middlewares/auth.middleware");


router.route("/checkout").post(authenticateUser, orderController.createOrder);

module.exports = router;
