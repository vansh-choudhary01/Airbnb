const User = require("../models/user");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signupUser = async (req, res) => {
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
};

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => { 
    req.flash("success", "Welcome back to wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // if(res.locals.redirectUrl) return res.redirect(res.locals.redirectUrl);
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};