import Joi, { ObjectSchema } from 'joi'

/*
* @author Prafful Bansal
* @description Joi validation for new user registration
*/
export const shippingAddressAchema: ObjectSchema = Joi.object({
    street: Joi.string().required().trim(),
    city: Joi.string().required().trim(),
    pincode: Joi.number().required().max(999999),
})

export const billingAddressAchema: ObjectSchema = Joi.object({
    street: Joi.string().required().trim(),
    city: Joi.string().required().trim(),
    pincode: Joi.number().required().max(999999),
})

export const addressSchema: ObjectSchema = Joi.object({
    shipping: shippingAddressAchema.required(),
    billing: billingAddressAchema.required(),
})

export const registerUserSchema : ObjectSchema = Joi.object({
    fname : Joi.string().required().trim().min(3).alphanum(),
    lname : Joi.string().required().trim().min(3).alphanum(),
    email : Joi.string().required().email().trim().lowercase(),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)).required(),
    phone: Joi.string().required().pattern(new RegExp(/^[6-9]\d{9}$/)),
    address: addressSchema.required()
})

/*
* @author Prafful Bansal
* @description Joi validation for user login
*/
export const loginUserSchema : ObjectSchema = Joi.object({
    email : Joi.string().required().email().trim().lowercase(),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)).required()
})

/*
* @author Prafful Bansal
* @description Joi validation for update user details
*/
export const updateUserSchema : ObjectSchema = Joi.object({
    fname : Joi.string().trim().min(3).alphanum(),
    lname : Joi.string().trim().min(3).alphanum(),
    email : Joi.string().email().trim().lowercase(),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)),
    phone: Joi.string().pattern(new RegExp(/^[6-9]\d{9}$/)),
    address: Joi.object({
        shipping: shippingAddressAchema,
        billing: billingAddressAchema,
    }),
})