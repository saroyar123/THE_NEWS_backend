const express=require('express');
const { auth } = require('../config/auth');
const { createPost, likePost, deletePost, commentOnPost, deleteComment } = require('../postFunction/postAction');

const router=express.Router();

router.post('/post/:token',auth,createPost);
router.get('/like/:id/:lu',auth,likePost);
router.delete('/post/:id',auth,deletePost);
router.post('/comment/:id',auth,commentOnPost);
router.delete('/comment/:id',auth,deleteComment)

module.exports=router;