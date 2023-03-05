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
        public_id:String,
        url:String,
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
      },],

    likedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    },],
    unlikePosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }],
    commentOnPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }],
    location: {
        name:String,
        coordinates: {
          latitude:Number,
          logititude:Number
        }
      },
    cteatedAt:{
        type:Date,
        default:Date.now()
    },
    value:{
        type:Number,
        default:100
    }
      
    
})

module.exports=mongoose.model("users",userSchema);