const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
      },],

    likedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    },]
})

module.exports=mongoose.model("users",userSchema);