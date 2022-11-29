const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

// register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
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

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ email: email }, process.env.jwtPrivateKey);

    await user.save();

    const option = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, option).json({
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
    const data = await User.find().populate('posts');

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
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .json({
        success:true,
        user
      });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};
