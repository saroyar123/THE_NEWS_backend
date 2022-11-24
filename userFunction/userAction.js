const User = require("../model/userModel");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "provide all document",
      });
    }

    let  lgUser;
    if(User.length>0)
    {
       lgUser=await User.findOne({email:email});
    }

    if(lgUser)
    {
        return res.status(400).json({
            success:false,
            message:"user already register"
        })
    }

    const user = await User.create({ name, email, password });

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};


// get all data of user

exports.getAllUser=async(req,res)=>{
  try {
    
      const data=await User.find();

      res.status(200).json({
        success:true,
        data
      })

  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
}