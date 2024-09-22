if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
// console.log(process.env)

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateList } = require("../middleware.js");
const { index, showListing, postListing, createListingForm, editListingForm, updateListing, distroyListing } = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    // Index Route
    .get(wrapAsync(index))
    // Post Route
    .post(isLoggedIn, upload.single('listing[image]'), validateList, wrapAsync(postListing));

// Create Route
router.get("/new", isLoggedIn, createListingForm);

router.route("/:id")
    // Show Route 
    .get(wrapAsync(showListing))
    // Update Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(updateListing))
    // Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(distroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListingForm));

module.exports = router;