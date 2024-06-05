const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultImageURL = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0";

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image: {
        type: String,
        default: defaultImageURL,
        set: (v) => v === "" ? defaultImageURL : v,
    },
    price:{
        type:Number,
    },
    country:{
        type:String,
    },
    location:{
        type:String,
    },

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;