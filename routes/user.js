const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { email, username, password } = req.body;
        let user = new User({ email, username });

        const registeredUser = await User.register(user, password);
        
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    wrapAsync(async (req, res) => { 
        req.flash("success", "Welcome back to wonderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        // if(res.locals.redirectUrl) return res.redirect(res.locals.redirectUrl);
        res.redirect(redirectUrl);
    }));

module.exports = router;

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
})