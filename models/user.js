const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true 
    },
    dob:{
        type:Date,
        required:true 
    },
    password:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('User',userSchema);