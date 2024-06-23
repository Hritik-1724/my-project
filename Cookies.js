const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser("Hk"));


app.get("/getSignedCookies",(req,res)=>{
    res.cookie("made-in","India",{signed:true});
    res.cookie("kabir","singh",{signed:true});
    res.send("Signedcookies is working");
})
app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("maza");
})


app.get("/getcookies",(req,res)=>{
    res.cookie("Love","nature");
    res.cookie("respect","elders");
    res.send("cookies is working");
})
app.listen(8080,()=>{
    console.log("server is listening");
})
