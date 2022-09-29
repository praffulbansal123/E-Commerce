import Joi, { ObjectSchema } from 'joi'

export const createOrderSchema:ObjectSchema = Joi.object({
    userId: Joi.string().required().alphanum().length(24).message('Please provide a valid user ID'),
    cancellable: Joi.boolean().default(true),
    status: Joi.string().default('pending').valid('pending', 'completed', 'cancelled'),
    deletedAt: Joi.date().default(null),
    isDeleted: Joi.boolean().default(false),
})

export const orderStstusSchema:ObjectSchema = Joi.object({
    userId: Joi.string().required().alphanum().length(24).message('Please provide a valid user ID'),
    orderId: Joi.string().required().alphanum().length(24).message('Please provide a valid order ID'),
    status: Joi.string().required().valid('pending', 'completed', 'cancelled')
})
