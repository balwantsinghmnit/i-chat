const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Post = require("../models/post");
const User = require("../models/user");


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.redirect('/user'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async(req, res) =>{
  const posts = await Post.find().sort({createdAt:"desc"});
  res.render("user/dashboard",{user:req.user,posts:posts});
});


//newpost handle
router.post("/addpost",ensureAuthenticated,async(req,res)=>{
  const post = new Post();
  post.title = req.body.title;
  post.description = req.body.description;
  post.creater = req.user;
  post.save();
  res.redirect("/dashboard");
});

//delete post handle
router.get("/deletepost/:id",ensureAuthenticated,async (req,res)=>
{
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});

//addcomment handle
router.post("/addcomment/:id/:postid",ensureAuthenticated,async (req,res)=>{
  const post = await Post.findOne({_id:req.params.postid});
  if(post==null)
  res.redirect("/dashboard");
  post.commentcount = post.commentcount+1;
  const user = await User.findOne({_id:req.params.id});
  const comment = {
      description:req.body.description,
      commenter:user
  };
  post.comments.push(comment);
  post.save();
  res.render(`user/comments`,{user:user,post:post});
});

//post comments handle
router.get("/comments/:id/:postid",ensureAuthenticated,async(req,res)=>{
  const post = await Post.findOne({_id:req.params.postid});
  if(post==null)
  res.redirect("/dashboard");
  const user=await User.findOne({_id:req.params.id});
  res.render("user/comments",{user:user,post:post});
});

 //account deletion
 router.get("/deleteuser/:id",ensureAuthenticated,async(req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/user/logout");
});

module.exports = router;