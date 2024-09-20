const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req);
    // console.log( ".." + req.originalUrl);
    if(!req.isAuthenticated()) {
        //redirect url save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id : listingId} = req.params;
    let {_id : userid} = req.user;
    let listing = await Listing.findById(listingId);
    // console.log(userid);
    // console.log(listing.owner._id);
    if(userid.equals(listing.owner._id)) {
        return next();
    } else {
        // return next(new ExpressError(401, "Owner and your account is not similler. So you can't update or delete this listing"));
        req.flash("error", "You don't have permission to edit or delete");
        res.redirect(`/listings/${listingId}`);
    }
}

module.exports.validateList = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.message;
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    let {id : listingId} = req.params;
    let {reviewId} = req.params;
    let {_id : userid} = req.user;
    let review = await Review.findById(reviewId);

    if(userid.equals(review.author._id)) {
        return next();
    } else {
        req.flash("error", "You don't have permission to edit or delete");
        res.redirect(`/listings/${listingId}`);
    }
}