const Product = require("../modal/productModal");

// Get all products
exports.getAllProducts = async function (req, res) {
  try {
    const { category, page, limit } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const filter = category ? { category } : {};
    const skip = (pageNumber - 1) * limitNumber;

    const allProducts = await Product.find(filter)
      .skip(skip)
      .limit(limitNumber);

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

//GET A SINGLE PRODUCT  BY ID
exports.getProduct = async function (req, res) {
  try {
    const id = req.params?.id;
    
    const product = await Product.findById(id);
    console.log(product);
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
