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
    },],
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
})


module.exports=mongoose.model("post",postSchema);