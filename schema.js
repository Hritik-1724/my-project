const joi = require("joi");
 module.exports.listingSchema = joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image:joi.string().allow("",null),
        price:joi.string().required().min(0),
        country:joi.string().required(),
        location:joi.string().required(),
    }).required()
});


// for reviews
module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),
    }).required()
});