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

router.post("/post", auth, createPost);
router.get("/like/:id/:lu", auth, likePost);
router.delete("/deletepost/:id", auth, deletePost);
router.post("/comment/:id", auth, commentOnPost);
router.delete("/comment/:id", auth, deleteComment);
router.get("/getAllPosts", getAllPosts);

module.exports = router;
