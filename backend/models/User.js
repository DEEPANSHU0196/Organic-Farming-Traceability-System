const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["farmer", "buyer", "transporter", "consumer", "admin"],
      default: "buyer",
    },

    phone: String,

    address: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);