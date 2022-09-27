import Joi, { ObjectSchema } from 'joi'

export const addProductToCartSchema: ObjectSchema = Joi.object({
    productId: Joi.string().required().trim().hex(),
    quantity: Joi.number().min(1).required()
})

export const removeProductFromCartSchema: ObjectSchema = Joi.object({
    productId: Joi.string().required().trim().hex(),
    removeProduct: Joi.number().valid(0, 1).required() 
})