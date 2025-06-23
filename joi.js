const Joi = require('joi');
const Listings = require('./models/listingSchema');
module.exports.listingSchema=Joi.object({
    Listings:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null)
    }).required()
});
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required(),
        comment:Joi.string().required(),
    }).required()
});

Schema=Joi.object({
    object:Joi.object({

    }).required()
})