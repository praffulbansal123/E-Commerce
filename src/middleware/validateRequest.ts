import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';
import { registerUserSchema} from '../schemas/userJoiSchema'


/*
* @author Prafful Bansal
* @description Joi validation for the incoming request
*/
const formDataValidator = (req : Request, next : NextFunction, schema : any) => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    let requestBody = {...req.body}
    
    if(requestBody.address) {
        requestBody.address = JSON.parse(requestBody.address);
    }
    
    const { error, value } = schema.validate(requestBody, options);
    if (error) {
        logger.info(error)
         error.status = 422; //
       return next(error);
    } else {
        req.body = value;
       return next();
    }
}

export const createUserSchema = (req: Request, res: Response, next : NextFunction) => {
    const schema = registerUserSchema
    formDataValidator(req, next, schema);
}