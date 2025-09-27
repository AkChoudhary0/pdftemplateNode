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
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    phone:{
        type:String,
    }
},{timestamps:true})

module.exports = mongoose.model("users",users)