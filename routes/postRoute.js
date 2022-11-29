const express=require('express');
const { auth } = require('../config/auth');
const { createPost, likePost, deletePost } = require('../postFunction/postAction');

const router=express.Router();

router.post('/post',auth,createPost);
router.post('/like/:id',auth,likePost);
router.delete('/post/:id',auth,deletePost);

module.exports=router;