const Post = require("../model/postModel");
const User = require("../model/userModel");

// create post
exports.createPost = async (req, res) => {
  try {
    const { caption, image } = req.body;
    if (!caption || !image) {
      return res.status(400).json({
        success: false,
        message: "need all document",
      });
    }
    const userPost = await Post.create({ caption, image });
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
    const likedPost = await Post.findOne({ _id: postId });
    if (!likedPost) {
      return res.status(400).json({
        success: false,
        message: "post not found",
      });
    }

    const liked = likedPost.likes.includes(req.user._id);

    if (liked) {
      const index = likedPost.likes.indexOf(req.user._id);
      likedPost.likes.splice(index, 1);
      await likedPost.save();

      const userIndex = req.user.likedPosts.indexOf(postId);
      req.user.likedPosts.splice(userIndex, 1);
      await req.user.save();

      return res.status(200).json({
        success: true,
        message: "you are unliked the post",
      });
    }

    likedPost.likes.push(req.user);
    await likedPost.save();

    req.user.likedPosts.push(likedPost);
    await req.user.save();

    res.status(200).json({
      success: true,
      message: "you like the post",
    });
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
