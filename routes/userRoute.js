const express=require('express');
const { auth } = require('../config/auth');
const { register, getAllUser, userLogin, deleteUser, logout} = require('../userFunction/userAction');

const router=express.Router();

router.post("/user",register);
router.get("/getUser",auth,getAllUser);
router.get('/login',userLogin);
router.delete('/deleteUser',auth,deleteUser);
router.get('/logout',auth,logout);


module.exports=router;