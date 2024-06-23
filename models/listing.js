const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultImageURL = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0";
const Review = require("./review.js")
const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image: {
        url: String,
        filename:String,
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
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }

});
// to handle deletion
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;