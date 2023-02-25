const mongoose=require('mongoose');
const locationSchema=new mongoose.Schema({
    location: {
        name:String,
        coordinates: {
          latitude:Number,
          logititude:Number
        }
      },
    localPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }],
    localUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }]
})

module.exports=mongoose.model("location",locationSchema);