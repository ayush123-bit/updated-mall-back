const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
  },
  categoryImage: {
    type: String,
    required: true,  // If you need to enforce that every product has a category image
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,  // URL or path to the product image
  },
  stock: {
    type: Number,
    default: 0,
  }
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
