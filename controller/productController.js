const Product = require("../modal/productModal");

// Get all products
exports.getAllProducts = async function (req, res) {
  try {
    const allProducts = await Product.find({});
    res.status(200).json({
      status: "success",
      products: allProducts,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

//GET A SINGLE PRODUCT
exports.getProduct = async function (req, res) {
  try {
    const id = req.params?.id;
    const product = await Product.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        product: [product],
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

//create a new product
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
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};
