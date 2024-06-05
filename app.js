const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cors = require('cors');


app.set("view engine",'ejs');
app.set("views",path.join("views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);
app.use(express.json());
app.use(
    cors({
        origin:['http//localhost:8080'],
        methods:["GET","POST","PUT","DELETE"],
        credentials:true
    })
)

main()
.then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
// index route
app.get("/listings",async(req,res)=>{
    let allListings = await Listing.find({});
    // console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
})
// new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
 })
// Create
app.post("/listings",async(req,res)=>{
   let newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
}) 
// edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})
// update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let updatedListing = await  Listing.findByIdAndUpdate(id,{...req.body.listing});
    // console.log(updatedListing);
    res.redirect(`/listings/${id}`)
 }) 

 // delete route
 app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deleletedListing = await Listing.findByIdAndDelete(id);
    console.log(`Deleted Listing details : ${deleletedListing}`);
    res.redirect("/listings");
 })

// show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})





// to check
app.get("/",(req,res)=>{
    res.send("root is working");
})
app.listen(8080,()=>{
    console.log("server is listening");
})

// app.get("/testListing",(req,res)=>{
//     const newListing = new Listing({
//         title:"Hrtk's_Villa",
//         description:"A sweet place",
//         price:1200,
//         country:"India",
//         location:"Dhanbad,Jharkhand",
//     })
//     newListing.save();
//     console.log("Data saved");
//     res.send("Success test");
// })
