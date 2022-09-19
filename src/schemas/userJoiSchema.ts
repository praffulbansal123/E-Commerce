import Joi from 'joi'

/*
* @author Prafful Bansal
* @description Joi validation for new user registration
*/
export const registerUserSchema : any = Joi.object({
    fname : Joi.string().required().trim().min(3).alphanum(),
    lname : Joi.string().required().trim().min(3).alphanum(),
    email : Joi.string().required().email().trim().lowercase(),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)).required(),
    phone: Joi.string().required().pattern(new RegExp(/^[6-9]\d{9}$/)),
    address: Joi.object({
        shipping: Joi.object({
            street: Joi.string().required().trim(),
            city: Joi.string().required().trim(),
            pincode: Joi.number().required().max(999999),
        }).required(),
        billing: Joi.object({
            street: Joi.string().required().trim(),
            city: Joi.string().required().trim(),
            pincode: Joi.number().required().max(999999),
        }).required(),
    }).required(),
})

/*
* @author Prafful Bansal
* @description Joi validation for user login
*/
export const loginUserSchema : any = Joi.object({
    email : Joi.string().required().email().trim().lowercase(),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)).required()
})

/*
* @author Prafful Bansal
* @description Joi validation for update user details
*/
export const updateUserSchema : any = Joi.object({
    fname : Joi.string().trim().min(3).alphanum(),
    lname : Joi.string().trim().min(3).alphanum(),
    email : Joi.string().email().trim().lowercase(),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)),
    phone: Joi.string().pattern(new RegExp(/^[6-9]\d{9}$/)),
    address: Joi.object({
        shipping: Joi.object({
            street: Joi.string().required().trim(),
            city: Joi.string().required().trim(),
            pincode: Joi.number().required().max(999999),
        }),
        billing: Joi.object({
            street: Joi.string().required().trim(),
            city: Joi.string().required().trim(),
            pincode: Joi.number().required().max(999999),
        }),
    }),
})