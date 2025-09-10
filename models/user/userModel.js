const mongoose = require('mongoose')
const Schema = mongoose.Schema

const users = new Schema({
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    name:{
        type:String,
    },
    phone:{
        type:String,
    }
},{timestamps:true})

module.exports = mongoose.model("users",users)