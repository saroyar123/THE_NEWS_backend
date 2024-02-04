const jwt= require('jsonwebtoken');
const User=require('../model/userModel')

exports.auth=async(req,res,next)=>{
    try {
        // console.log(req.headers.authorization)
        const token =req.headers.authorization.split(' ')[1];
        // console.log(token)
        if(!token) throw new Error("Token Not Found")


        const userEmail=jwt.verify(token,process.env.jwtPrivateKey);
        const user=await User.findOne({email:userEmail.email})

        if(!user)
        {
            return res.status(200).json({
                success:false,
                message:"you are not authinticated"
            })
        }

        req.user=user;

        next();

    } catch (error) {
        res.status(200).json({
            success:false,
            message:error.message
        })
    }
}