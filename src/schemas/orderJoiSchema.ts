import { OrderableReplicationInstance } from 'aws-sdk/clients/dms'
import Joi, { ObjectSchema } from 'joi'

export const createOrderSchema:ObjectSchema = Joi.object({
    cancellable: Joi.boolean().default(true),
    status: Joi.string().default('pending').valid('pending', 'completed', 'cancelled'),
    deletedAt: Joi.date().default(null),
    isDeleted: Joi.boolean().default(false),
})

export const orderStstusSchema:ObjectSchema = Joi.object({
    status: Joi.string().required().valid('pending', 'completed', 'cancelled')
})
