
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itineraryDataSchema = new Schema({
    data:{
        type:Object
    },
    hostName:{
        type:String
    }
},{timestamps:true })

module.exports = mongoose.models?.ItineraryData || mongoose.model('itinerarydata', itineraryDataSchema) 