const mongoose = require("mongoose");
const {data} = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wonderlust";
async function main(){
    await mongoose.connect(mongoUrl);
}

main().then(() => {
    console.log("connected database"); 
}) .catch(e => {
    console.log(e);
}); 

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("data was initialized");
} 

initDB();