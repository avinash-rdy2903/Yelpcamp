const express=require("express"),
	  mongoose=require("mongoose"),
	  passport = require("passport"),
	  bodyParser=require("body-parser"),
	  localStrategy = require("passport-local"),
	  expressSession = require("express-session"),
	  methodOverride = require("method-override"),
	  flash = require("connect-flash"),
	  Campgrounds=require("./models/campgrounds"),
	  User = require("./models/user"),
	  Comments=require("./models/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  commentRoutes = require("./routes/comments"),
	  indexRoutes = require("./routes/index"),
	  app=express(),
	  seedDB=require("./models/seedDB");

//MONGODB
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");
//seedDB();

//Express initials

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

//AUTH

app.use(require("express-session")({
	secret:"A random sequence of words, which are to ensure the cryptograpy safe and sound :)",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");

	next();
})
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);

app.listen(process.env.PORT || 5000,process.env.IP,function(){
	console.log("Running...");
});