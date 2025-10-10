const Order = require("../modal/orderModal");
const Product = require("../modal/productModal");
const User = require("../modal/userModal");

// ******************************************************************//
// -----------------------PRODUCT SECTION-----------------------//
// ******************************************************************//
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
// -----------------------ORDER SECTION-----------------------//
// ******************************************************************//

// Fetch all orders of the
exports.getAllOrders = async function (req, res) {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limit;

    const allOrders = await Order.find({})
      .skip(skip)
      .limit(limitNumber)
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
      return res.status(404).json({
        status: "fail",
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
// ******************************************************************//
// -----------------------USERS SECTION-----------------------//
// ******************************************************************//

// Fetch all users
exports.getAllUsers = async function (req, res) {
  try {
    const { isBlocked, page, limit } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    let filter = { role: "user" };
    if (isBlocked) {
      filter.isBlocked = isBlocked === "true"; // converting to string to boolean
    }

    const allUsers = await User.find(filter).skip(skip).limit(limitNumber);
    res.status(200).json({
      status: "success",
      data: allUsers,
    });
  } catch (err) {
    res.status(400).json({
      status: "success",
      message: err.message,
    });
  }
};

// Block user
exports.blockUser = async function (req, res) {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(404).json({
        status: "failed",
        message: "You are not logged in please login",
      });
    }
    const { id } = req.params;
    console.log(id);

    if (!id) throw new Error(`No user id, Redirecting to login page  `);

    const user = await User.findById({ _id: id });

    if (!user)
      throw new Error(
        `No user found with that id, Please create your account an login..Happy shopping`
      );
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
//////////////////////

// ******************************************************************//
// -----------------------PRODUCTS SECTION-----------------------//
// ******************************************************************//

exports.getAllProducts = async function (req, res) {
  try {
    const { category, page, limit } = req.query;
    const filter = category ? { category } : {};
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const totalProducts = await Product.countDocuments(filter);

    const allProducts = await Product.find(filter)
      .skip(skip)
      .limit(limitNumber);
    return res.status(200).json({
      status: "success",
      data: allProducts,
      totalProducts,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

//Add product
exports.addProduct = async function (req, res) {
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
      status: "success",
      data: newProduct,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

//Delete products
exports.deleteProduct = async function (req, res) {
  try {
    const { productId } = req.params;
    if (!productId)
      throw new Error("No product Id please provide a product id ");
    await Product.findByIdAndDelete(productId);
    res.status(200).json({
      status: "success",
      data: "deleted succesfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.editProduct = async function (req, res) {
  try {
    const { productId } = req.params;
    const { description, price, stock, name, image, category } = req.body;

    console.log("Prodsuct ID:", productId);
    console.log("Requestr body:", req.body);

    if (!productId)
      throw new Error("No product id. Please provide a product id");

    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (category !== undefined) updateData.category = category;

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        status: "failed",
        message: "No such product exists",
      });
    }

    console.log("Updated product:", product);

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
