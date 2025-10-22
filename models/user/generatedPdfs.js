const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generatedPdfs = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    pdfUrl: String,
    type: String,
    name: String,
    flightDate1: Date,
    flightDate2: { type: Date, default: null },
    price: String,
    fileName: String,
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("generatedPdfs", generatedPdfs);
