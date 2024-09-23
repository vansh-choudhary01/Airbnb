const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.search = async (req, res) => {
    let {location} = req.query;
    console.log(location);
    let allListings = await Listing.find().or([{country : location}, {location}]);
    res.render("listings/index.ejs", { allListings });
}

module.exports.createListingForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    // let reviews = await Review.find({_id : {$in : listing.reviews}});
    console.log(listing);
    if (!listing) {
        req.flash("error", "Listing you requested for it does not exist");
        return res.redirect("/listings");
    }

    let lat = "28.6138954";
    let lon = "77.2090057";
    try {
        let city = `${listing.location} ${listing.country}`;

        // Nominatim API URL to fetch geocoded data
        let url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(city)}`;

        console.log('Fetching URL:', url);

        // Fetch data from Nominatim
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Wonderlust/1.0 (your.email@example.com)'
            }
        })

        let data = await response.json();
        // console.log(data);

        if (data.length > 0) {
            // Filter to return only city-level first result
            let cityData = data[0];
            lat = cityData.lat;
            lon = cityData.lon;
        }
    } catch (e) {
        console.log(e);
    }

    res.render("listings/show.ejs", { listing, lat, lon });
};

module.exports.postListing = async (req, res, next) => {
    let img = {};
    if (req.file) {
        img.url = req.file.path,
            img.filename = req.file.filename
    }
    let data = new Listing({ ...req.body.listing, owner: req.user, image: img });
    await data.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
};

module.exports.editListingForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for it does not exist");
        res.redirect("/listings");
    }

    let originalImg = listing.image.url;
    originalImg = originalImg.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImg });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    console.log(req.body);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(listing);

    if (req.file) {
        let { path, filename } = req.file;
        listing.image = { url: path, filename };
        await listing.save();
    }
    req.flash("success", "Listing is updated");
    res.redirect(`/listings/${id}`);
};

module.exports.distroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("remove", "A listing is deleted");
    res.redirect("/listings");
};