if(process.env.NODE_ENV="production"){
    require('dotenv').config();

}



const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cors = require('cors');
app.use(cors());
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
// router
const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const reviewsRouter = require("./routes/review.js");
//
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



app.use(cookieParser());


app.set("view engine",'ejs');
app.set("views",path.join("views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);
app.use(express.json());

const mongUrl = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLAS_DB_URL;
main()
.then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}




// sessions
const store = MongoStore.create({
mongoUrl:dbUrl,
crypto:{
    secret:process.env.SECRET,
},
touchAfter:24*3600,
});

const sessionOptions = {
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};
// app.get("/",(req,res)=>{
//     res.send("root is working");
// })

app.use(session(sessionOptions));
app.use(flash());

// passport setUp
// passport
app.use(passport.initialize());
app.use(passport.session());
//passport-local
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for flash
app.use((req,res,next)=>{
    res.locals.Smsg=req.flash("success");
    res.locals.Emsg=req.flash("error");
    // for req.user in login
    res.locals.currUser=req.user;
    next();
})




// demo user
// app.get("/demoUser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"Karan@gmail.com",
//         username:"Karan",

//     });
//     let registeredUser = await User.register(fakeUser,"AlluArjun");
//     res.send(registeredUser);
// })


//  listing
app.use("/listings",listingsRouter);
// review
app.use("/listings/:id/reviews", reviewsRouter);

// user
app.use("/", userRouter);







// for wrong route
app.all("*",(req,res,next)=>{
     next(new ExpressError(404,"page not found"));
})

// ERROR MIDDLEWARE 
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err;
    res.status(status).render("error.ejs",{err});

    // res.status(status).send(message);
    
    // res.send("Something went wrong");
})


// to check

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
