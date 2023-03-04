const User = require("../model/userModel");
const Post=require("../model/postModel");
const jwt = require("jsonwebtoken");
const LocationDB=require('../model/location');

// register user
exports.register = async (req, res) => {
  try {
    const { name, email, password,location } = req.body;

    if (!name || !email || !password||!location) {
      return res.status(400).json({
        success: false,
        message: "provide all document",
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
      });
    }

    const user = await User.create({ name, email, password,location });

    const LocalUser=await LocationDB.findOne({name:location.name});
    if(!LocalUser)
    {
      const newLocation=await LocationDB.create({location});
      newLocation.localUsers.push(user);
      await newLocation.save();
    }
    else
    {
      LocalUser.localUsers.push(user);
      await LocalUser.save();
    }

    console.log("token");
    console.log(process.env.jwtPrivateKey);
    const token = jwt.sign({ email: email }, process.env.jwtPrivateKey);
    console.log(token)

    await user.save();


    res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// get all data of user

exports.getAllUser = async (req, res) => {
  try {
    const data = await User.find({email:req.user.email}).populate('posts');

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// login for user
exports.userLogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    // console.log(req.cookie)

    if (!password || !email) {
      return res.status(400).json({
        success: false,
        message: "provide all data",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "register first",
      });
    }

    const token = jwt.sign({ email: email }, process.env.jwtPrivateKey);

    res
      .status(200)
      .json({
        success:true,
        user,
        token
      });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// delete user
exports.deleteUser=async(req,res)=>{
  try {
    
    // delete all the post of the use

    req.user.posts.map(async(postId,index)=>{
      const postOfUser=await Post.findOne({_id:postId});
      
      if(postOfUser)
       await postOfUser.remove();
    })

    // delete userId from like array of post that like by user
    req.user.likedPosts.map(async(postId,index)=>{
      const likedPost=await Post.findOne({_id:postId});
      if(likedPost)
      {
        let index=-1;
        index=likedPost.likes.indexOf(req.user._id);
        if(index>=0)
        {
          likedPost.likes.splice(index,1);
          await likedPost.save();
        }
      }
    })

    await req.user.remove();

    res.status(200).cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true
    }).json({
      success:true,
      message:"your account is deleted"
    })


  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
}

// logout user

exports.logout=async(req,res)=>{
  try {
    
    res.status(200).cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true
    }).json({
      success:true,
      message:"you are logout"
    })



  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
}

