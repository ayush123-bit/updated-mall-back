const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
  type: String,
  default: '', // or a default image URL
},
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the date to the current time
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
