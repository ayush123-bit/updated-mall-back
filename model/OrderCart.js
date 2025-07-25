const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the date to the current date/time
  },
  status: {
    type: String,

    default: 'Active', // Default status is 'Active'
  },
});

const CartSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the date to the current date/time
  }
});

const UserSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
    unique: true,
  },
  orders: [OrderSchema],
  carts: [CartSchema],
});

const OrderCart = mongoose.model('OrderCart', UserSchema);

module.exports = OrderCart;
