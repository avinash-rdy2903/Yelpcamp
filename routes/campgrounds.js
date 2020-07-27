const express = require("express"),
	  router = express.Router();
	  Campgrounds = require("../models/campgrounds"),
	  Comments = require("../models/comments"),
	  middleware = require("../middleware");
router.get("/",function(req,res){
	Campgrounds.find({},function(err,campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campground/index",{campgrounds:campgrounds});
		}
	});
});

router.post("/",middleware.isLogedIn,function(req,res){
	Campgrounds.create(req.body.result,function(err,camp){
		if(err){
			console.log(err);
		}else{
			camp.author={id:req.user.id,username:req.user.username};
			camp.save(function(){
				res.redirect("/campgrounds");
			});	
		}
	});
	
});

router.get("/new",middleware.isLogedIn,function(req,res){
	res.render("campground/newCampground");
});

router.get("/:id",function(req,res){
	Campgrounds.findById(req.params.id).populate("comments").exec(function(err,result){
		if(err || !result){
			req.flash("error","Campground not found");
			res.redirect("/campgrounds");
		}else{
			res.render("campground/show",{res:result});
		}
	});
});

router.get("/:id/edit",middleware.userPermissions,async (req,res)=>{
	try{
		let campground = await Campgrounds.findById(req.params.id);
		res.render("campground/edit",{campground:campground});
	}catch(err){
		console.log(err);
	}
})

router.put("/:id",middleware.userPermissions,(req,res)=>{
	Campgrounds.findByIdAndUpdate(req.params.id,req.body.result,(err,campground)=>{
		if(err){
			console.log(err);
			res.redirect("/"+req.params.id+"edit");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

router.delete("/:id",middleware.userPermissions,async(req,res)=>{
	try{
		let campground = await Campgrounds.findById(req.params.id);
		campground.comments.forEach(async function(comment){
			await Comments.findByIdAndDelete(comment);
		})
		await campground.remove();
		res.redirect("/campgrounds");
	}catch(err){
		console.log(err);
		res.redirect("/campgrounds/"+req.params.id);
	}
})


module.exports = router;