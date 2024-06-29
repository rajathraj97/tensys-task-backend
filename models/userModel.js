const mongoose = require('../../node_modules/mongoose')

const {Schema} = mongoose

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:"user"
    }
},{timestamps:true})

const User = mongoose.model('UserModel',userSchema)

module.exports = User