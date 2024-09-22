const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.object({
            url : Joi.string().allow("", null).required(),
            filename : Joi.string().allow("", null).required()
        })
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        comment : Joi.string().required(),
        rating : Joi.number().required().min(0).max(5),
        createdAt : Joi.date(),
    }).required()
})