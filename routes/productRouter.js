const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const { authenticateUser } = require("../middlewares/auth.middleware");

router
  .route("/")
  .get( productController.getAllProducts)
  .post(productController.createProduct);

router.route("/:id").get(productController.getProduct);

module.exports = router;
