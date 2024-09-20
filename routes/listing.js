const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateList} = require("../middleware.js");

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// Create Route
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

// Show Route 
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    // let reviews = await Review.find({_id : {$in : listing.reviews}});
    console.log(listing);
    if(!listing) {
        req.flash("error", "Listing you requested for it does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}))

router.post("/",isLoggedIn, validateList, wrapAsync(async (req, res, next) => {
    let data = new Listing({...req.body.listing, owner : req.user});
    await data.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
}));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for it does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}))

router.put("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    console.log(req.body);
    let data = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(data);

    req.flash("success", "Listing is updated");
    res.redirect(`/listings/${id}`);
}))

router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("remove", "A listing is deleted");
    res.redirect("/listings");
}))

module.exports = router;