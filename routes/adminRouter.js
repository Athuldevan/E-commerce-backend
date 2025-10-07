const express = require("express");
const router = express.Router();
const { restrictTo } = require("../middlewares/role.middleware");
const { authenticateUser } = require("../middlewares/auth.middleware");

const adminController = require("../controller/adminController");

router.get("/orders", adminController.getAllOrders);

router
  .route("/createProduct")
  .post(authenticateUser, restrictTo("admin"), adminController.createProduct);

router
  .route("/deleteProduct/:productId")
  .delete(authenticateUser, restrictTo("admin"), adminController.deleteProduct);

router
  .route("/updateProduct/:productId")
  .patch(authenticateUser, restrictTo("admin"), adminController.updateProduct);

router.route("/viewOrder/:orderId").get(adminController.viewOrder);

module.exports = router;
