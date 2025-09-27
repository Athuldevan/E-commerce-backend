const express = require("express");
const { authenticateUser } = require("../middlewares/auth.middleware");
const router = express.Router();
const cartController = require("../controller/cartController");
const Cart = require("../modal/cartModal");

router.route("/").get(authenticateUser, cartController.getCartItems);

router.route("/add-to-cart/:productId").post(authenticateUser, cartController.addToCart);

router.route

module.exports = router;
