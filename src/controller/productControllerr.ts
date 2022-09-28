import { Request, Response, NextFunction, RequestHandler} from 'express';
import mongoose from 'mongoose';
import { IFiles } from '../interface/vendors/files';
import ProductUpdate from '../interface/vendors/productUpdate';
import logger from '../logger/logger';
import {createProductService, getProductService, getProductByIdService, updatePoductService, deleteProductService} from '../services/productService'


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

export const getProductByIdHandler:RequestHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const productId:string = req.params.productId

        const product = await getProductByIdService(productId)

        return res.status(200).send({status: true, message: 'Product Details Fetched', data: product})
    } catch (error : any) {
        logger.info(error.message);
        next(error);
    }
}

export const updateProductHandler: RequestHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const productId:string = req.params.productId
        const requestBody:ProductUpdate = req.body
        const image:IFiles = req.files
        
        const updatedPoduct = await updatePoductService(productId, requestBody, image)

        return res.status(200).send({status: true, message: 'Product Details updated successfully', data: updatedPoduct})

    } catch (error : any) {
        logger.info(error.message);
        next(error)
    }
}

export const deleteProductHandler: RequestHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const productId:string = req.params.productId

        const deletedProduct = await deleteProductService(productId)

        return res.status(200).send({status: true, message: 'Product deleted successfully', data: deletedProduct})

    } catch (error : any) {
        logger.info(error.message);
        next(error)
    }
}