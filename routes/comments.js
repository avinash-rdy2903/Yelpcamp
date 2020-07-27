const express = require("express"),
	  router = express.Router({mergeParams:true}),
	  Campgrounds = require("../models/campgrounds"),
	  Comments = require("../models/comments"),
	  middleware = require("../middleware");

router.get("/new",middleware.isLogedIn,function(req,res){
	Campgrounds.findById(req.params.id,function(err,result){
		if(err || !result){
			req.flash("error","campground not found");
			res.redirect("/campgrounds");
		}else{
			res.render("comment/new",{result:result});
		}
	})
});

router.post("/",middleware.isLogedIn, async function(req,res){
	try{
		let campground= await Campgrounds.findById(req.params.id);
		let comment   = await Comments.create(req.body.comment);
		if(!campground){
			req.flash("error","Error in finding the campground");
			return res.redirect("back");
		}
		comment.author ={id: req.user.id,username:req.user.username};
		await comment.save();
		campground.comments.push(comment);
		await campground.save();
		res.redirect("/campgrounds/"+req.params.id);
	}catch(err){
		req.flash("error","Cannot find the campground");
	}
});

router.get("/:comment_id/edit", function(req,res){
	Comments.findById(req.params.comment_id,function(err,comment){
		if(err || !comment){
			req.flash("error","retry");
			res.redirect("back")
		}else{
			res.render("comment/edit",{comment:comment,campId:req.params.id,user:req.user});
		}
	})
})

router.put("/:comment_id",middleware.commentAuthentication,function(req,res){
	Comments.findByIdAndUpdate(req.params.comment_id,{text:req.body.text},(err,comment)=>{
		if(err || !comment){
			req.flash("error","Something went wrong");
			return res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

router.delete("/:comment_id",middleware.commentAuthentication,async (req,res)=>{
	try{    
		let campground = await Campgrounds.findById(req.params.id);
		if(!campground){
			req.flash("error","campground not found");
			return res.redirect("back");
		}
		for(var i=0;i<campground.comments.length;i++){
			if(await campground.comments[i].equals(req.params.comment_id)){
				break;
			}
		}
		campground.comments.splice(i,1);
		await campground.save();
		await Comments.findByIdAndDelete(req.params.comment_id);
		res.redirect("/campgrounds/"+req.params.id);
	}catch(err){
		console.log(err);
	}
})

module.exports = router;