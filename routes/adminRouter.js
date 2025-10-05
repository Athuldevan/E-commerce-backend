const express = require("express");
const router = express.Router();
const { restrictTo } = require("../middlewares/role.middleware");
const { authenticateUser } = require("../middlewares/auth.middleware");

const adminController = require("../controller/adminController");

router
  .route("/createProduct")
  .post(authenticateUser, restrictTo("admin"), adminController.createProduct);

router.route("/deleteProduct/:productId").delete(adminController.deleteProduct);

module.exports = router;
