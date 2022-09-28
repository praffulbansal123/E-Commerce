import Joi, { ObjectSchema } from 'joi'

export const createOrderSchema: ObjectSchema = Joi.object({
    cancellable: Joi.boolean().default(true),
    status: Joi.string().default('pending').valid('pending', 'completed', 'canceled'),
    deletedAt: Joi.date().default(null),
    isDeleted: Joi.boolean().default(false),
})
