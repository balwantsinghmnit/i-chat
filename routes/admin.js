const express = require("express");
const router = express.Router();
const bcrypt=require("bcryptjs");
const Admin = require("../models/admin");
const Post = require("../models/post");
const User = require("../models/user");
var logged=false;
router.get("/",(req,res)=>{
  res.redirect("admin/login");
});
router.get("/login",(req,res)=>{
    res.render("admin/login");
});

// Dashboard
router.get('/dashboard/:admin', ensureAuthenticated, async(req, res) =>{
  const posts = await Post.find().sort({createdAt:"desc"});
  const users = await User.find();
  res.render("admin/dashboard",{admin:req.params.admin,posts:posts,users:users});
});

//delete post handle
router.get("/deletepost/:id/:admin",ensureAuthenticated,async (req,res)=>
{
  await Post.findByIdAndDelete(req.params.id);
  res.redirect(`/admin/dashboard/${req.params.admin}`);
});



router.post("/register",(req,res)=>{
    const { mobile,password,password2} = req.body;
    let errors = [];
  
    if (!mobile || !password || !password2) {
      errors.push({ msg: 'Please Enter All Fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
      }
    
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
      }

      if (errors.length > 0) {
        res.send(errors);
      }
      else
      {
        Admin.findOne({ mobile: mobile })
        .then(user => 
            {
                if (user) 
                {
                errors.push({ msg: 'This mobile no. already exists' });
                } 
                else 
                {
                const newAdmin = new Admin({mobile,password});
        
                    bcrypt.genSalt(10, (err, salt) => 
                    {
                            bcrypt.hash(newAdmin.password, salt, (err, hash) => 
                            {
                            if (err) throw err;
                            newAdmin.password = hash;
                            newAdmin
                                .save()
                                .then(user => {
                                req.flash(
                                    'success_msg',
                                    'New admin is now registered and can log in'
                                );
                                res.redirect('/admin/login');
                                })
                                .catch(err => console.log(err));
                            });
                    });
                }
          });
        }
    
    });

// Login
router.post('/login', async(req, res) => {
  const admin = await Admin.findOne({mobile:req.body.mobile});
  if(admin==null)
  res.send("Invalid admin no.");
  else
  {
    if(bcrypt.compare(req.body.password,admin.password))
    {
      logged=true;
      res.redirect(`/admin/dashboard/${admin}`);
    }
    else
    {
      res.send("Wrong password");
    }
  }
});


// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin/login');
});

function ensureAuthenticated(req,res,next)
{
  if(logged)
  next();
  else
  res.redirect("/admin/login");
}


module.exports = router;