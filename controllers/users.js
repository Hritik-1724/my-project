const User = require("../models/user.js");


module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signUp=async (req, res,next) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        // auto login
        req.login(registeredUser,(err)=>{
            if(err){return next(err);}
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })
        
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are loggedout");
        res.redirect("/listings");
    });
}