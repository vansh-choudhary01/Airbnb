const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReview = async (req, res) => {
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
};

module.exports.distroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("remove", "A review is deleted");
    res.redirect(`/listings/${id}`);
};