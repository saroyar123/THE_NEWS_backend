const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    caption:{
        type:String,
        required:true
    },
    description:{
      type:String,
      required:true
    },
    image:{
        public_id:String,
        url:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },],
    disLikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
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
            ref:"users"
        }
    }]
})


module.exports=mongoose.model("post",postSchema);