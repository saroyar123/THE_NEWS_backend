const express = require("express");
const { auth } = require("../config/auth");
const {
  createPost,
  likePost,
  deletePost,
  commentOnPost,
  deleteComment,
  getAllPosts,
} = require("../postFunction/postAction");

const router = express.Router();

router.post("/post/:token", auth, createPost);
router.get("/like/:token/:id/:lu", auth, likePost);
router.delete("/deletepost/:token/:id", auth, deletePost);
router.post("/comment/:token/:id", auth, commentOnPost);
router.delete("/comment/:token/:id", auth, deleteComment);
router.get("/getAllPosts", getAllPosts);

module.exports = router;
