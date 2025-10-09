const express = require("express");
const router = express.Router();
const { restrictTo } = require("../middlewares/role.middleware");
const { authenticateUser } = require("../middlewares/auth.middleware");
const adminController = require("../controller/adminController");


router
  .route("/users")
  .get(authenticateUser, restrictTo("admin"), adminController.getAllUsers);


router.get(
  "/orders",
  authenticateUser,
  restrictTo("admin"),
  adminController.getAllOrders
);



router
  .route("/products")
  .get(authenticateUser, restrictTo("admin"), adminController.getAllProducts);

router
  .route("/users/:id")
  .put(authenticateUser, restrictTo("admin"), adminController.blockUser);

router
  .route("/addProduct")
  .post(authenticateUser, restrictTo("admin"), adminController.addProduct);

router
  .route("/deleteProduct/:productId")
  .delete(authenticateUser, restrictTo("admin"), adminController.deleteProduct);

router
  .route("/updateProduct/:productId")
  .patch(authenticateUser, restrictTo("admin"), adminController.updateProduct);

router
  .route("/viewOrder/:orderId")
  .get(authenticateUser, restrictTo("admin"), adminController.viewOrder);

router
  .route("/changeOrderStatus/:orderId")
  .put(
    authenticateUser,
    restrictTo("admin"),
    adminController.changeOrderStatus
  );

module.exports = router;
