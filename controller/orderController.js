const Cart = require("../modal/cartModal");
const Order = require("../modal/orderModal");

// Order creation
exports.createOrder = async function (req, res) {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({
        status: "failed",
        message: "pleae login first",
      });
    }

    //  Fetch all cart
    const cartItems = await Cart.find({ userId: loggedInUser._id }).populate(
      "productId"
    );

    if (cartItems.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "Cart is empty",
      });
    }

    //MAPPING PRODCUCTSSSS INCLUDING QUANITITYY
    const products = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    //TOTAL PRICE
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );
    // CREATING A NEW ORDER
    const newOrder = await Order.create({
      userId: loggedInUser?._id,
      products,
      totalPrice,
      status: "pending",
    });

    //CLEARING THE CART AFTER CHECKOUTT
    await Cart.deleteMany({ userId: loggedInUser._id });

    return res.status(201).json({
      status: "success",
      data: newOrder,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
// ******************************************************************//
//GET ALL ORDERS of the logged user
exports.getAllOrders = async function (req, res) {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.json({
        status: "failed",
        message: "Please Login first",
      });
    }
    const allOrders = await Order.find({ userId: loggedInUser?._id }).populate(
      "products.productId"
    );

    res.status(200).json({
      status: "success",
      orders: allOrders,
    });
  } catch (err) {
    res.json({
      status: "failed",
      message: err.message,
    });
  }
};

// ******************************************************************//

//DELETE ORDER
exports.deleteOrder = async function (req, res) {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({
        status: "failed",
        message: "please Login first",
      });
    }

    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        status: "success",
        message: "Invalid order id or No such order exists with this order id ",
      });
    }

    const isExist = await Order.findOne({ userId: loggedInUser, _id: orderId });

    if (!isExist) {
      return res.status(400).json({
        status: "success",
        message: "No such product found",
      });
    }

    await Order.findOneAndDelete({ userId: loggedInUser._id, _id: orderId });

    res.status(203).json({
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
//******************************************************************/

// GET ALL ORDERS
