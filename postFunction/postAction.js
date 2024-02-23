const Post = require("../model/postModel");
const User = require("../model/userModel");
const LocationDB=require('../model/location');
const cloudinary=require('cloudinary');

// create post
exports.createPost = async (req, res) => {
  try {
    const { caption, image,description,location} = req.body;

    if (!caption || !image||!description||!location) {
      return res.status(400).json({
        success: false,
        message: "need all document",
        data:null
      });
    }

    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "theNews_posts",
    });
    

    const userPost = await Post.create({ 
      caption,
      description,
      image:{
        public_id: myCloud.public_id, 
        url: myCloud.secure_url,
      },
      owner:req.user,
      location
    });
    req.user.posts.push(userPost);
    await req.user.save();

    console.log("post create")
    const LocalUser=await LocationDB.findOne({name:location.name});
    if(!LocalUser)
    {
      const newLocation=await LocationDB.create({location});
      newLocation.localPosts.push(userPost);
      await newLocation.save();
    }
    else
    {
      LocalUser.localPosts.push(userPost);
      await LocalUser.save();
    }

    res.status(200).json({
      success: true,
      message:"post created",
      data:userPost,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// like & unlike  post by user

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    let lu=0;
    lu=req.params.lu;  // a value that determine user like or unlike the post
    // 1 for the like or remove the like 
    // 2 for unlike and the remove the unlike
    lu=parseInt(lu);
    // console.log(typeof(lu))

    const thePost = await Post.findOne({ _id: postId });
    if (!thePost) {
      return res.status(400).json({
        success: false,
        message: "post not found",
        data:null
      });
    }

    const liked = thePost.likes.includes(req.user._id);
    const unliked=thePost.disLikes.includes(req.user._id);

    // remove like from the post
    if (liked&&lu===1) {
      const index = thePost.likes.indexOf(req.user._id);
      thePost.likes.splice(index, 1);
      await thePost.save();

      const userIndex = req.user.likedPosts.indexOf(postId);
      req.user.likedPosts.splice(userIndex, 1);
      await req.user.save();

      return res.status(200).json({
        success: true,
        message: "you are like is remove from the post",
        data:null
      });
    }
    else if(lu===1)
    {

      // if the post unliked
      if(unliked)
      {
        const index = thePost.disLikes.indexOf(req.user._id);
        thePost.disLikes.splice(index, 1);
        await thePost.save();
  
        const userIndex = req.user.unlikePosts.indexOf(postId);
        req.user.unlikePosts.splice(userIndex, 1);
        await req.user.save();
      }

      // like the post
      thePost.likes.push(req.user);
      await thePost.save();
  
      req.user.likedPosts.push(thePost);
      await req.user.save();
  
      return res.status(200).json({
        success: true,
        message: "you like the post",
        data:null
      });
    }

    
// remove the unlike from the post
    if (unliked&&lu===2) {
      const index = thePost.disLikes.indexOf(req.user._id);
      thePost.disLikes.splice(index, 1);
      await thePost.save();

      const userIndex = req.user.unlikePosts.indexOf(postId);
      req.user.unlikePosts.splice(userIndex, 1);
      await req.user.save();

      return res.status(200).json({
        success: true,
        message: "you are unlike is remove from the post",
        data:null
      });
    }
    else if(lu===2)
    {
      // if the post liked
      if(liked)
      {
        const index = thePost.likes.indexOf(req.user._id);
        thePost.likes.splice(index, 1);
        await thePost.save();
  
        const userIndex = req.user.likedPosts.indexOf(postId);
        req.user.likedPosts.splice(userIndex, 1);
        await req.user.save();
      }
     
      // unlike the post
      thePost.disLikes.push(req.user);
      await thePost.save();

      req.user.unlikePosts.push(thePost);
      await req.user.save();

      return res.status(200).json({
        success:true,
        message:"unlike the post",
        data:null
      })
    }


    res.status(200).json({
      success:false,
      message:"something is wrong",
      data:null
    })

  
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data:null
    });
  }
};

// delete post

exports.deletePost = async (req, res) => {
  try {
    console.log("delete call")
    const postId = req.params.id;
    console.log(postId)
    
    const post = await Post.findOne({ _id: postId.toString() });

    if (!post) {
      return res.status(200).json({
        success: false,
        message: "post not found",
        data:null
      });
    }
    // console.log(postId)


    // delete the image from cloudnary
    await cloudinary.v2.uploader.destroy(post.image.public_id);

    let userIndex = -1;
    userIndex = await req.user.posts.indexOf(postId);

    //    console.log(userIndex);
    if (userIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "you not authenticated user or post not found",
        data:null
      });
    }

    req.user.posts.splice(userIndex, 1);
    await req.user.save();

    post.likes.map(async (value, id) => {
      const likeByUser = await User.findOne({ _id: value });
      let likeByUserIndex = -1;
      likeByUserIndex = likeByUser.likedPosts.indexOf(postId);
      if (likeByUserIndex != -1) {
        likeByUser.likedPosts.splice(likeByUserIndex, 1);
        await likeByUser.save();
      }
    });

    await post.remove();

    res.status(200).json({
      success: true,
      message: "your post is successfully deleted",
      data:null
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data:null
    });
  }
};


// comment on a post

exports.commentOnPost=async(req,res)=>{
  try { 
    const post_Id=req.params.id;
    const {comment}=req.body;

    if(!post_Id||!comment)
    {
      return res.status(400).status({
        success:false,
        message:"some data is mising",
        data:null

      })
    }
    const post=await Post.findOne({_id:post_Id});
    post.comments.reverse();
    post.comments.push({comment:comment,commented_user:req.user});
    post.comments.reverse();
    await post.save();

    req.user.commentOnPosts.push(post);
    await req.user.save();

    res.status(200).json({
      success:true,
      message:"Your comment is added",
      data:null
    })


  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data:null
    });
  }
};

// delete the authenticated user's comment

exports.deleteComment=async(req,res)=>{
  try {
    const post_Id=req.params.id;

    const post=await Post.findOne({_id:post_Id});
    if(!post)
    {
       return res.status(400).json({
        success:false,
        message:"post not exist",
        data:null
       })
    }

    let index_user=-1;
    let index_post=-1;
    
    for(index_user=0;index_user<post.comments.length;index_user++)
    {
      if(post.comments[index_user].commented_user.equals(req.user._id))
       {
        //  await post.comments[index_user].remove();
         break;
       }
    }
    
    index_post=req.user.commentOnPosts.indexOf(post_Id);

    console.log(index_post,index_user)

    if(index_user==-1)
    {
      return res.status(400).json({
        success:false,
        message:"comment first",
        data:null
      })
    }

    if(index_post==-1)
    {
      return res.status(400).json({
        success:false,
        message:"user may not comment on this post",
        data:null
      })
    }

    post.comments.splice(index_user,1);
    await post.save();

    req.user.commentOnPosts.splice(index_post,1);
    await req.user.save();

    res.status(200).json({
      success:true,
      message:"your comment is deleted",
      data:null
    })


  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data:null
    });
  }
}


// get all the  post for the 

exports.getAllPosts=async(req,res)=>{
  try {
    
    const Posts=await Post.find().populate('owner').populate({
      path:"comments.commented_user",
      model:"users"
    });
    res.status(200).json({
      success:true,
      message:"get all the posts",
      data:Posts
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data:null
    });
  }
}