const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true 
    },
    creater:{
        type:Object,
        required:true 
    },
    commentcount:{
        type:Number,
        default:0
    },
    comments:{
        type:Array
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model('Post',postSchema);