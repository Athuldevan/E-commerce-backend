const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product should have a name"],
    unique: [true, "This product already exists"],
  },

  description: {
    type: String,
    trim: true,
  },

  price: {
    type: Number,
    required: [true, "A product should have a price"],
  },

  image: {
    type: String,
    required: [true, "A product should have a image"],
    default:
      "https://images.unsplash.com/photo-1671119720870-df45dcaf81c1?q=80&w=1955&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  rating: {
    type: Number,
    default: 4.5,
  },

  category: {
    type: String,
    required: [true, "A product should have a category"],
    trim: true,
  },

  count: {
    type: Number,
    default: 10,
  },

  isActive: {
    type: Boolean,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
