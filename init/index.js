const mongoose = require("mongoose");
let {data} = require("./data.js");
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
    data = data.map((obj) => {return {...obj, owner : "66ebdbcf02295ec352910b10"}});
    await Listing.insertMany(data);
    console.log("data was initialized");
} 

initDB();