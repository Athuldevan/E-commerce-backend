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

//ADD TO CART
exports.addToCart = async function (req, res) {
  try {
    const loggedInUser = req.user;
    const { productId } = req.params;

    if (!loggedInUser) {
      return res.status(400).json({
        status: "failed",
        message: "Please Login first.",
      });
    }
    const { quantity } = req.body;

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

//UPDATE CART QUANTITY
exports.updateCartQuantity = async function (req, res) {
  try {
    const loggedInUser = req.user;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!loggedInUser) {
      return res.status(401).json({
        status: "failed",
        message: "please login first",
      });
    }

    const cartItem = await Cart.findOne({
      productId,
      userId: loggedInUser._id,
    });

    if (!cartItem) {
      return res.status(400).json({
        status: "failed",
        message: "Invaid product id",
      });
    }

    cartItem.quantity = Number(quantity);

    // Prevent going below 1
    if (cartItem.quantity < 1) {
      cartItem.quantity = 1;
    }

    await cartItem.save();
    await cartItem.populate("productId");

    res.status(201).json({
      status: "success",
      message: "Cart quantity upated succesfully",
      data: cartItem,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
