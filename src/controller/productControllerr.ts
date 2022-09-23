import { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import logger from '../logger/logger';
import {createProductService, getProductService} from '../services/productService'


export const createProductHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        
        const requestBody = req.body
        const image = req.files

        const product = await createProductService(requestBody, image)

        return res.status(201).send({status: true, message: 'Product created successfully', data: product})

    } catch (error : any) {
        logger.info(error.message);
        if(error instanceof mongoose.Error.ValidationError){
            return res.status(400).send({status: false, message : error.message});
         }
        next(error);
    }
}

export const getProductHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const requestBody = req.body
        const products = await getProductService(requestBody)

        return res.status(200).send({status: true, message: 'Product Details Fetched', data: products})

    } catch (error : any) {
        logger.info(error.message);
        next(error);
    }
}

