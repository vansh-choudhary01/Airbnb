const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signupForm, signupUser, loginForm, logoutUser, loginUser } = require("../controllers/user.js");

router.route("/signup")
    .get(signupForm)
    .post(wrapAsync(signupUser));

router.route("/login")
    .get(loginForm)
    .post(saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        wrapAsync(loginUser));

router.get("/logout", logoutUser);

module.exports = router;