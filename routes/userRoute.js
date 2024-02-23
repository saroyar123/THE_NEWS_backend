const express=require('express');
const { auth } = require('../config/auth');
const { register, getAllUser, userLogin, deleteUser, logout, post_Near_to_User} = require('../userFunction/userAction');

const router=express.Router();

router.post('/login',userLogin);
router.post("/register",register);
router.get("/getUser",auth,getAllUser);
router.delete('/deleteUser',auth,deleteUser);
router.get('/logout',auth,logout);
router.get('/nearPosts',auth,post_Near_to_User);


module.exports=router;