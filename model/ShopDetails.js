const mongoose = require('mongoose');

const ShopkeeperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Shopkeeper = mongoose.model('Shopkeeper', ShopkeeperSchema);

module.exports = Shopkeeper;
