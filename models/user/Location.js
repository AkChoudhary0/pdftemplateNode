const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: { type: String },
    description: [{ type: String }],
    note: { type: String },
    img: { type: String },
    img2: { type: String },
    img3: { type: String },
    SIC_price: { type: Number },
    PVT_price: { type: Number },
    transfer_price: { type: Number },
    VIP_price: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.models?.Location || mongoose.model("Location", locationSchema);
