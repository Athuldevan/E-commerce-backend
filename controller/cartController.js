const Cart = require("../modal/cartModal");
const Product = require("../modal/productModal");

exports.getCartItems = async function (req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Please Login firstr ",
      });
    }
    const carts = await Cart.find({ userId: user?._id }).populate("productId");

    res.status(200).json({
      status: "success",
      data: carts,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.addToCart = async function (req, res) {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({
        status: "failed",
        message: "Please Login first.",
      });
    }
    const { quantity, productId } = req.body;

    //Checking if the product is already exisit in the cart
    const isAlreadyInCart = await Cart.findOne({
      userId: loggedInUser._id,
      productId: productId,
    });
    if (isAlreadyInCart) {
      return res.status(200).json({
        status: "success",
        message: "This product is already in the cart",
      });
    }
    //else
    const newCartItem = await Cart.create({
      userId: loggedInUser._id,
      productId,
      quantity: quantity || 1,
    });

    await newCartItem.populate("productId");

    res.status(201).json({
      status: "success",
      data: newCartItem,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
