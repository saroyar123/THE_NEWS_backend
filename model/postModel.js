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
    disLikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
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
    verify:{
        type:Boolean,
        default:false
    },
    comments:[{
        comment:String,
        commented_user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    }]
})


module.exports=mongoose.model("post",postSchema);