const express=require('express');
const { auth } = require('../config/auth');
const { register, getAllUser, userLogin, deleteUser, logout} = require('../userFunction/userAction');

const router=express.Router();

router.post('/login',userLogin);
router.post("/register",register);
router.get("/getUser/:token",auth,getAllUser);
router.delete('/deleteUser/:token',auth,deleteUser);
router.get('/logout/:token',auth,logout);


module.exports=router;