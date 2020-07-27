var middlewareObj = {};
const Campgrounds = require("../models/campgrounds"),
	  Comments = require("../models/comments");
middlewareObj.userPermissions = async function (req,res,next){
	if(req.isAuthenticated()){
		try{
			let campground = await Campgrounds.findById(req.params.id);
			if(!campground){
				req.flash("error","campground not found");
				return res.redirect("back");
			}
			if(campground.author.id.equals(req.user.id)){
				return next();
			}
			req.flash("error","You dont have permission");
			res.redirect("back");
		}catch(err){
			req.flash("error","Campground not found");
			res.redirect("back");
		}
	}else{
		req.flash("error","You have to login");
		res.redirect("/login");
	}
}

middlewareObj.isLogedIn = function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","you need to Login first!!");
	res.redirect("/login");
}

middlewareObj.commentAuthentication = async function (req,res,next){
	try{
		let comment = await Comments.findById(req.params.comment_id);
		if(!commnet || req.user && comment.author.id.equals(req.user.id)){
			return next();
		}
		res.redirect("back");
	}catch(err){
		req.flash("error",err.message);
	}
}

module.exports = middlewareObj;