const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const { wrap } = require("module");

const mongoUrl = "mongodb://127.0.0.1:27017/wonderlust";
async function main(){
    await mongoose.connect(mongoUrl);
}

main().then(() => {
    console.log("connected database"); 
}) .catch(e => {
    console.log(e);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const validateList = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.message;
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.send("hi i'm root");
});

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// Create Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

// Show Route 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    // let reviews = await Review.find({_id : {$in : listing.reviews}});
    // console.log(reviews);
    res.render("listings/show.ejs", {listing});
}))

app.post("/listings", validateList, wrapAsync(async (req, res, next) => {
    let data = new Listing(req.body.listing);
    await data.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))

app.put("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body});
    res.redirect(`/listings/${id}`);
}))

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

//review Post route
app.post("/listings/:id/review",validateReview, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let {review} = req.body;
    
    let rating = new Review(review);
    let listing = await Listing.findById(id);
    listing.reviews.push(rating);

    await rating.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}));


// Delete review route
app.delete("/listings/:id/review/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    // res.send("something went wrong");
    let {statusCode=500, message="something Error Occour"} = err;
    // console.log(err);
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {err});
})
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});