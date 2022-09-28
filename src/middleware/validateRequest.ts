import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';
import { registerUserSchema, loginUserSchema, updateUserSchema} from '../schemas/userJoiSchema'
import {createProductSchema, getProductSchema, updateProductSchema} from '../schemas/productJoiSchema'
import {addProductToCartSchema, removeProductFromCartSchema} from '../schemas/cartJoiSchema'
import { createOrderSchema } from '../schemas/orderJoiSchema';

/*
* @author Prafful Bansal
* @description Joi validation for the incoming request
*/
const formDataValidator = (req:Request, next:NextFunction, schema:any) => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    
    let requestBody = {...req.body, ...req.query}
    
    if(requestBody.address) {
        requestBody.address = JSON.parse(requestBody.address);
    }
    
    if(requestBody.availableSizes) {
        requestBody.availableSizes = JSON.parse(requestBody.availableSizes);
    }

    if(requestBody.size){
        requestBody.size = JSON.parse(requestBody.size);
    }

    const { error, value } = schema.validate(requestBody, options);
    if (error) {
        logger.info(error)
         error.status = 422; 
       return next(error);
    } else {
        req.body = value;
       return next();
    }
}

const requestValidator = (req:Request, next:NextFunction, schema:any) => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        logger.info(error)
         error.status = 422; 
       return next(error);
    } else {
        req.body = value;
       return next();
    }
}

export const createUserSchema = (req:Request, res:Response, next:NextFunction) => {
    const schema = registerUserSchema
    formDataValidator(req, next, schema);
}

export const loginSchema = (req:Request, res:Response, next:NextFunction) => {
    const schema = loginUserSchema
    requestValidator(req, next, schema);
}

export const updateSchema = (req:Request, res:Response, next:NextFunction) => {
    const schema = updateUserSchema
    formDataValidator(req, next, schema);
}

export const productCreateSchema = (req:Request, res:Response, next:NextFunction) => {
    const schema = createProductSchema
    formDataValidator(req, next, schema)
}

export const productGetSchema = (req:Request, res:Response, next:NextFunction) => {
    const schema = getProductSchema
    formDataValidator(req, next, schema)
}

export const productUpdateSchema = (req:Request, res:Response, next:NextFunction) => {
    const schema = updateProductSchema
    formDataValidator(req, next, schema)
}

export const addProductSchema = (req:Request, res:Response, next:NextFunction) => {
    const schema = addProductToCartSchema
    requestValidator(req, next, schema);
}

export const removeProductSchema = (req:Request, res:Response, next:NextFunction) => {
    const schema = removeProductFromCartSchema
    requestValidator(req, next, schema);
}

export const orderCreateSchema = (req:Request, res:Response, next:NextFunction) => {
    const schema = createOrderSchema
    requestValidator(req, next, schema);
}