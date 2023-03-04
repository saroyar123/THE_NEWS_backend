const jwt= require('jsonwebtoken');
const User=require('../model/userModel')

exports.auth=async(req,res,next)=>{
    try {
        
        const {token}=req.params;
        console.log(req.params)
        if(!token)
        {
            return res.status(200).json({
                success:false,
                message:"you are not authinticated"
            })
        }


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