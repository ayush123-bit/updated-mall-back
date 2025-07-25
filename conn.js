const mongoose = require("mongoose");

mongoose.connect("Your Mongo Uri")
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });
