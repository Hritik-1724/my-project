const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

// signup get  and post
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync( userController.signUp));


// login  get and  login post
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), userController.login);


// logout
router.get("/logout",userController.logout);


module.exports = router;