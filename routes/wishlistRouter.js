const express = require("express");
const router = express.Router();

const wishlistController = require("../controller/wishlistController");
const { authenticateUser } = require("../middlewares/auth.middleware");

router.route("/").get(authenticateUser, wishlistController.getAllWishlistitems);

router
  .route("/add-to-wishlist/:productId")
  .post(authenticateUser, wishlistController.addToWishlist);

router
  .route("/delete-wishlist-item/:productId")
  .delete(authenticateUser, wishlistController.removeFromWishlist);

module.exports = router;
