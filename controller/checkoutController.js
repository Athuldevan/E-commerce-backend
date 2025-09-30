const Cart = require("../modal/cartModal");

exports.getCheckoutSummary = async function (req, res) {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({
        status: "success",
        message: "pleae login first",
      });
    }

    const cartItems = await Cart.find({ userId: loggedInUser._id }).populate(
      "productId"
    );

    if (cartItems.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "Cart is empty ",
      });
    }

    //checkout sumammary of the cart items
    const summaryItems = cartItems.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      description: item.productId.description,
      quantity: item.quantity,
      image: item.productId.image,
      subtotal: item.productId.price * item.quantity,
    }));

    //totoal price
    const totalPrice = summaryItems.reduce(
      (acc, item) => acc + item.subtotal,
      0
    );

    res.status(200).json({
      status: "success",
      products: summaryItems,
      total_Price: totalPrice,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
