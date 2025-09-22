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
    type: {
        type: String,
    },
    name: {
        type: String,
    },
    flightDate1:{
        type: Date,
    },
    flightDate2:{
        type: Date,
        default: null
    },
     price: {
        type: String,
    },
    fileName: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true })

module.exports = mongoose.model("generatedPdfs", generatedPdfs)