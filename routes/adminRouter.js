const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { restrictTo } = require("../middlewares/role.middleware");
const productController = require("../controller/productController");
const { authenticateUser } = require("../middlewares/auth.middleware");
const adminController = require("../controller/adminController");
const {upload} = require("../middlewares/cloudinart.middleware")

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

router.route("/forgotPassword").post(authController.forgotPassword);

router.route("/resetPassword/:token").patch(authController.resetPassword);

router
  .route("/users/:id")
  .put(authenticateUser, restrictTo("admin"), adminController.blockUser);

//add prodcut
console.log('add prodcut route reached ');
router
  .route("/addProduct")
  .post(
    authenticateUser,
    restrictTo("admin"),
    upload.single("image"),
    adminController.addProduct
  );

router
  .route("/viewProduct/:id")
  .get(authenticateUser, restrictTo("admin"), productController.getProduct);

router
  .route("/deleteProduct/:productId")
  .delete(authenticateUser, restrictTo("admin"), adminController.deleteProduct);

router
  .route("/editProduct/:productId")
  .put(authenticateUser, restrictTo("admin"), adminController.editProduct);

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
