import Joi, { ObjectSchema } from 'joi'

export const addProductToCartSchema: ObjectSchema = Joi.object({
    productId: Joi.string().required().trim().hex(),
    quantity: Joi.number().min(1)  
})