const Post = require("../model/postModel");
const User = require("../model/userModel");

// create post
exports.createPost = async (req, res) => {
  try {
    const { caption, image,location} = req.body;
    if (!caption || !image||!location) {
      return res.status(400).json({
        success: false,
        message: "need all document",
      });
    }
    const userPost = await Post.create({ caption, image,location});
    req.user.posts.push(userPost);
    await req.user.save();

    res.status(200).json({
      success: true,
      userPost,
    });
  } catch (error) {
    res.status(200).json({
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
        message:"unlike the post"
      })
    }


    res.status(400).json({
      success:false,
      message:"something is wrong"
    })

  
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// delete post

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "post not found",
      });
    }
    // console.log(postId)

    let userIndex = -1;
    userIndex = await req.user.posts.indexOf(postId);

    //    console.log(userIndex);
    if (userIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "you not authenticated user or post not found",
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
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
