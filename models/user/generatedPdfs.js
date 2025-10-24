const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generatedPdfsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    pdfUrl: { type: String, required: true },
    type: String,
    name: String,
    flightDate1: Date,
    flightDate2: { type: Date, default: null },
    price: String,
    fileName: String,
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("generatedPdfs", generatedPdfsSchema);
