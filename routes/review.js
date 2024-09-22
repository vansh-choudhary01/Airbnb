const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const { postReview, distroyReview } = require("../controllers/review.js");

//review Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(postReview));

// Delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(distroyReview));

module.exports = router;