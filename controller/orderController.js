const Cart = require("../modal/cartModal");
const Order = require("../modal/orderModal");

exports.createOrder = async function (req, res) {
  try {
    const loggedInUser = req?.user;
    if (!loggedInUser) {
      return res.status(401).json({
        status: "success",
        message: "pleae login first",
      });
    }
    const totalPrice = await Cart.calculateTotalPrice(loggedInUser._id);
    const cartItems = await Cart.find({ userId: loggedInUser._id }).populate(
      "productId"
    );
    if (cartItems.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "Cart is empty",
      });
    }
    // CREATING A NEW ORDER
    const newOrder = await Order.create({
      userId: loggedInUser?._id,
      products: cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      totalPrice: totalPrice,
    });

    return res.status(201).json({
      status: "success",
      message: newOrder,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getAllOrders = async function (req, res) {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.json({
        status: "sucess",
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
      status: "success",
      message: err.message,
    });
  }
};
