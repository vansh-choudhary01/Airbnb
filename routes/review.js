const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

//review Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let {review} = req.body;
    let {_id : userId} = req.user;
    
    let rating = new Review({...review, author : userId});
    let listing = await Listing.findById(id);
    listing.reviews.push(rating);

    await rating.save();
    await listing.save();

    req.flash("success", "new review is created");
    res.redirect(`/listings/${id}`);
}));


// Delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("remove", "A review is deleted");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;