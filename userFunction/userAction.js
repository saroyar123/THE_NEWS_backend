const User = require("../model/userModel");
const Post = require("../model/postModel");
const jwt = require("jsonwebtoken");
const LocationDB = require("../model/location");
const cloudinary = require("cloudinary");
const postModel = require("../model/postModel");
const { findDistance } = require("../location/locationActions");

// register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, location, image } = req.body;

    if (!name || !email || !password || !location || !image) {
      return res.status(400).json({
        success: false,
        message: "provide all document",
        data: null,
      });
    }

    let lgUser;
    if (User.length > 0) {
      lgUser = await User.findOne({ email: email });
    }

    if (lgUser) {
      return res.status(400).json({
        success: false,
        message: "user already register",
        data: null,
      });
    }

    // handel cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "theNewsUsers",
    });

    const user = await User.create({
      name,
      email,
      password,
      location,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    const LocalUser = await LocationDB.findOne({ name: location.name });
    if (!LocalUser) {
      const newLocation = await LocationDB.create({ location });
      newLocation.localUsers.push(user);
      await newLocation.save();
    } else {
      LocalUser.localUsers.push(user);
      await LocalUser.save();
    }

    const token = jwt.sign({ email: email }, process.env.jwtPrivateKey);
    // console.log(token)

    await user.save();

    res.status(201).json({
      success: true,
      message: "User Register Success fully",
      data: {
        token: token,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// get all data of user

exports.getAllUser = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.user.email }).populate({
      path: "posts",
      populate: {
        path: "comments.commented_user",
        model: "users",
      },
    });

    res.status(200).json({
      success: true,
      message: "All data of user are send",
      data: userData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// login for user
exports.userLogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!password || !email) {
      return res.status(400).json({
        success: false,
        message: "provide all data",
        data: null,
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "register first",
        data: null,
      });
    }

    const token = jwt.sign({ email: email }, process.env.jwtPrivateKey);

    res.status(200).json({
      success: true,
      message: "User Login Success Fully",
      data: {
        token: token,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    // delete all the post of the use

    req.user.posts.map(async (postId, index) => {
      const postOfUser = await Post.findOne({ _id: postId });

      if (postOfUser) await postOfUser.remove();
    });

    // delete userId from like array of post that like by user
    req.user.likedPosts.map(async (postId, index) => {
      const likedPost = await Post.findOne({ _id: postId });
      if (likedPost) {
        let index = -1;
        index = likedPost.likes.indexOf(req.user._id);
        if (index >= 0) {
          likedPost.likes.splice(index, 1);
          await likedPost.save();
        }
      }
    });

    await req.user.remove();

    res.status(200).json({
      success: true,
      message: "your account is deleted",
      data: null,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// logout user

exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "you are logout",
      data: {
        id: req.user._id,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// find the posts which are near to user
exports.post_Near_to_User = async (req, res) => {
  try {
    const userLocation = req.user.location.coordinates;
    const distance = parseInt(req.query.distance) || 100;

    const allPosts = await postModel.find().populate({
      path: "posts",
      populate: {
        path: "comments.commented_user",
        model: "users",
      },
    });
    const userNearPosts = allPosts.filter((posts) => {
      return findDistance(userLocation, posts.location.coordinates) <= distance;
    });

    res.status(200).json({
      success: true,
      data: userNearPosts,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};
