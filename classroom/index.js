const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/", (req, res) => {
    res.send("this is root");
})

app.get("/user", (req, res) => {
    res.send("this is user route");
})

app.get("/setcookies", (req, res) => {
    res.cookie("greet", "hellow");
    res.cookie("origin", "india");
    res.send("this is send cookie roote");
})

app.get("/getcookies", (req, res) => {
    console.dir(req.cookies);
    res.send("this is get cookie route");
})

app.get("/greet", (req, res) => {
    let {name = "anonymous"} = req.cookies;
    res.send(`HI ! ${name}`);
})

app.get("/getsignedcookies", (req, res) => {
    res.cookie("made-in", "india", {signed : true});
    res.send("signed cookie sent");
})

app.get("/verify", (req, res) => {
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.send("verified");
})

app.listen(8080, () => {
    console.log("app is listening");
})