const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// imp
const passportLocalMongoose =  require("passport-local-mongoose");
const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});

// for username and password ,
//  because "passport-local-mongoose"  generate username and passord auto 
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);