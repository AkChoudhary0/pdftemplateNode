const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: { type: String },
    description: {type:[]},
    note: { type: String },
    img: { type: String },
    img1: { type: String },
    img2: { type: String },
    sic_price: { type: Number },
    pvt_price: { type: Number },
    child_price: { type: Number },
    adult_price: { type: Number },
    transfer_price: { type: Number },
    vip_price: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.models?.Location || mongoose.model("location", locationSchema);
