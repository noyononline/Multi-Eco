const { Schema, model } = require("mongoose");

const sellerCustomerSchema = new Schema(
  {
    myId: {
      type: String,
      required: true,
      ref: "User",
    },
    myFriends: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = model("seller_customers", sellerCustomerSchema);
