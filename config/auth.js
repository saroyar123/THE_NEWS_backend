const jwt= require('jsonwebtoken');
const User=require('../model/userModel')

exports.auth=async(req,res,next)=>{
    try {
        // console.log(req.headers.authorization)
        const token =req.headers.authorization.split(' ')[1];
        // console.log(token)
        if(!token) throw new Error("Token Not Found")


        const userEmail=jwt.verify(token,process.env.jwtPrivateKey);
        const user=await User.findOne({email:userEmail.email}).populate({
            path:"posts",
            populate:{      
                path:"comments.commented_user",
                model:"users"
            }
        })

        if(!user)
        {
            return res.status(400).json({
                success:false,
                message:"you are not authinticated"
            })
        }

        req.user=user;

        next();

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}