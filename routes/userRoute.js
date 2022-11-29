const express=require('express');
const { auth } = require('../config/auth');
const { register, getAllUser, userLogin} = require('../userFunction/userAction');

const router=express.Router();

router.post("/user",register);
router.get("/getUser",auth,getAllUser);
router.get('/login',userLogin);


module.exports=router;