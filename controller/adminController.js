const Order = require("../modal/orderModal");
const Product = require("../modal/productModal");

// Creaate a Product
exports.createProduct = async function (req, res) {
  try {
    const { name, description, price, image, category, brand, rating, count } =
      req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      category,
      brand,
      rating,
      count,
    });

    res.status(201).json({
      status: "message",
      data: newProduct,
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};
// ******************************************************************//

// Delete product
exports.deleteProduct = async function (req, res) {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "No Such product exist!",
      });
    }
    return res.status(203).json({
      status: "success",
      data: x,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
// ******************************************************************//

// UPDATE product;
exports.updateProduct = async function (req, res) {
  try {
    const { productId } = req.params;
    const { description, price, image, count } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        description,
        price,
        image,
        count,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: "success",
        message: "No such product exist",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(200).json({
      status: "Success",
      message: err.message,
    });
  }
};
// ******************************************************************//

// Fetch all orders of the
exports.getAllOrders = async function (req, res) {
  try {
    const allOrders = await Order.find({})
      .populate("products.productId")
      .populate({ path: "userId", select: "name" });
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenue[0].totalRevenue;
    res.status(200).json({
      status: "success",
      data: allOrders,
      totalRevenue,
    });
  } catch (err) {
    res.status(400).json({
      status: "success",
      message: err.message,
      stack: err.stack,
    });
  }
};
