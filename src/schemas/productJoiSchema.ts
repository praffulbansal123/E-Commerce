import Joi, { ObjectSchema } from 'joi'

/*
* @author Prafful Bansal
* @description Joi validation for new product
*/
export const createProductSchema: ObjectSchema = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    price: Joi.number().required().min(0).precision(2),
    currencyId: Joi.string().required().valid('INR', 'GBP'),
    currencyFormat: Joi.string().required().trim(),
    isFreeShipping: Joi.boolean().default(false),
    productImage: Joi.string().trim(),
    style: Joi.string(),
    availableSizes: Joi.array().items(Joi.string().valid("S", "XS","M","X", "L","XXL", "XL")).min(1).required(),
    installments: Joi.number().required(),
    deletedAt: Joi.date().default(null),
    isDeleted: Joi.boolean().default(false),
})

export const getProductSchema: ObjectSchema = Joi.object({
    size: Joi.array().items(Joi.string().valid("S", "XS","M","X", "L","XXL", "XL")).min(1),
    name: Joi.string().trim().min(2),
    priceGreaterThan: Joi.number(),
    priceLessThan: Joi.number(),
    priceSort: Joi.number().valid(1,-1)
})