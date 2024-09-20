const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const sectionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(session(sectionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
}) 

app.get("/register", (req, res) => {
    let {name = "ananomus"} = req.query;
    console.log(req.session);
    req.session.name = name;

    if(name == "ananomus") {
        req.flash("error", "user not registered");
    } else {
        req.flash("success", "user register successfully");
    }
    res.redirect("/hello");
})

app.get("/hello", (req, res) => {
    // res.send(`hello ${req.session.name}`);
    // console.log(req.flash("success"));
    
    res.render("page.ejs", {name : req.session.name});
})

app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`you sent a request ${req.session.count} times`);
})

// app.get("/test", (req, res) => {
//     res.send("this is a express-session check route");
// })

app.listen(8080);