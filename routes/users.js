const express = require("express");
const router = express.Router();
const bcrypt=require("bcryptjs");
const passport = require('passport');
const User = require("../models/user");

router.get("/",(req,res)=>{
  res.redirect("user/login");
});
router.get("/login",(req,res)=>{
    res.render("user/login");
});
router.get("/register",(req,res)=>{
    res.render("user/register");
});

router.post("/register",(req,res)=>{
    const { name, mobile,email, password, password2,dob } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2 || !dob) {
      errors.push({ msg: 'Please Enter All Fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
      }
    
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
      }

      if (errors.length > 0) {
        res.render('user/register', {
          errors,
          name,
          email,
          password,
          password2
        });
      }
      else
      {
        User.findOne({ mobile: mobile })
        .then(user => 
            {
                if (user) 
                {
                errors.push({ msg: 'User with this mobile no. already exists' });
                res.render('user/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
                } 
                else 
                {
                const newUser = new User({name,mobile,email,dob,password });
        
                    bcrypt.genSalt(10, (err, salt) => 
                    {
                            bcrypt.hash(newUser.password, salt, (err, hash) => 
                            {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/user/login');
                                })
                                .catch(err => console.log(err));
                            });
                    });
                }
          });
        }
    
    });

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/login');
});


module.exports = router;