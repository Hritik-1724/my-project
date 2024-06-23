const Listing = require("../models/listing.js");


module.exports.index = async(req,res)=>{
    let allListings = await Listing.find({});
    // console.log(Listing);
    res.render("./listings/index.ejs",{allListings});
}
module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs");
 }
 module.exports.createNewListing=async(req,res,next)=>{
      let url = req.file.path;
        let filename = req.file.filename;
        // console.log(url, "...", filename );
        const newListing = new Listing(req.body.listing);
      
        // owner
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        await newListing.save();
        req.flash("success","New Listing added !")
       
        console.log(newListing);
        res.redirect("/listings");
      
 }
module.exports.renderEditForm=async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does't exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
   
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async(req,res)=>{
    // validation schema middleware kr chuke hai
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    //   }
    let {id} = req.params;
    // option dena jruri hai
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = {url,filename};
    await updatedListing.save();
   }
    req.flash("success"," Listing Updated !");
    res.redirect(`/listings/${id}`);
 }
 module.exports.destroyListing=async(req,res)=>{
    let {id} = req.params;
    let deleletedListing = await Listing.findByIdAndDelete(id);
    console.log(`Deleted Listing details : ${deleletedListing}`);
    req.flash("success"," Listing deleted !")
    res.redirect("/listings");
 }
 module.exports.showListing=async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },

    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does't exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}