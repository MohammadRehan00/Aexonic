const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique:true
      
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
     trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
