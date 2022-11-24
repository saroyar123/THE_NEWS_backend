const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    caption:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }]
})


module.exports=mongoose.model("post",postSchema);