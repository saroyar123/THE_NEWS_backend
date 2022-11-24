const express=require('express');
const { register, getAllUser} = require('../userFunction/userAction');

const router=express.Router();

router.post("/user",register);
router.get("/getUser",getAllUser);

module.exports=router;