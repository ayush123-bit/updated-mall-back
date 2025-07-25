const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for messages
const messageSchema = new Schema({
  userEmail: { // Email of the user sending the message
    type: String,
    required: true,
    trim: true,
  },
  messages: [{ // Array of messages
    content: { // Content of the message
      type: String,
      required: true,
    },
    date: { // Date when the message was sent
      type: Date,
      default: Date.now,
    },
  }],
  responses: [{ // Array of responses from the shopkeeper
    shopkeeperEmail: { // Email of the shopkeeper responding
      type: String,
      required: true,
    },
    response: { // Content of the response
      type: String,
      required: true,
    },
    date: { // Date when the response was sent
      type: Date,
      default: Date.now,
    },
  }],
});

// Create the model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
