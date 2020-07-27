const express = require("express"),
	  router = express.Router(),
	  User = require("../models/user"),
	  passport = require("passport");
router.get("/",function(req,res){
	res.render("lander");
});
router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
		if(err){
			req.flash("error",err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,()=>{
			res.redirect("/campgrounds");
		})
	})
})

router.get("/login",(req,res)=>{
	res.render("login",{message:req.flash("error")});
});

router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),(req,res)=>{
	
});

router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Loged you out!");
	res.redirect("/campgrounds")
})


module.exports = router;