const express = require("express");
const router = express.Router();

const adminController = require("../controller/adminController");

router.route("/createProduct").post(adminController.createProduct);

module.exports = router;
