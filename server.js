const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const router = require("./routes/index");
const userRouter = require("./routes/users");
const app = express();

//passport config
require("./config/passport")(passport);

//database
const db = require("./config/keys").MongoURI;
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("database connected"))
.catch(e=>console.log(e));

app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
//passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
app.use("/",router);
app.use("/user",userRouter);


const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server started on port no ${port}`);
})