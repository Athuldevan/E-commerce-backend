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
      data: null,
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
//-------------ORDER SECTION
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

// ******************************************************************//

//View the Order
exports.viewOrder = async function (req, res) {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(404).json({
        status: "fail",
        message: `Please login in `,
      });
    }
    const { orderId } = req.params;

    if (!orderId) throw new Error(`No order id `);
    const order = await Order.findById(orderId).populate("products.productId");
    res.status(200).json({
      status: "sucess",
      data: order,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({
      status: "success",
      message: err.message,
    });
  }
};
// ******************************************************************//

//Chnage the status of the order
exports.changeOrderStatus = async function (req, res) {
  console.log(req);
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!req.user) {
      return res.status(401).json({
        status: "failed",
        message: `Please login `,
      });
    }

    if (!orderId || !status) {
      return res.status(404).json({
        status: "fail",
        message: "Please provide the orderId and status ",
      });
    }
    const order = await Order.findByIdAndUpdate(
      { _id: orderId },
      { status: status },
      { new: true, runValidators: true }
    );

    if (!order)
      return res
        .status(404)
        .json({
          status: "success",
          message: "There is no such product exists",
        });

    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (err) {
    res.json({
      status: "failed",
      message: err.message,
    });
  }
};
