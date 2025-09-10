const mongoose = require('mongoose')
const Schema = mongoose.Schema

const generatedPdfs = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    pdfUrl: {
        type: String,
    },
    customerName: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true })

module.exports = mongoose.model("generatedPdfs", generatedPdfs)