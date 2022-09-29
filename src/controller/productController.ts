import { Request, Response, NextFunction, RequestHandler} from 'express';
import mongoose from 'mongoose';
import IProduct from '../interface/models/product';
import { IFiles } from '../interface/vendors/files';
import {IProductUpdate, IRBCreateProduct, IRBGetProduct} from '../interface/vendors/product';
import logger from '../logger/logger';
import {createProductService, getProductService, getProductByIdService, updatePoductService, deleteProductService} from '../services/productService'


export const createProductHandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {
        
        const requestBody:IRBCreateProduct = req.body
        const image:IFiles = req.files

        const product:IProduct = await createProductService(requestBody, image)

        return res.status(201).send({status: true, message: 'Product created successfully', data: product})

    } catch (error:any) {
        logger.info(error.message);
        if(error instanceof mongoose.Error.ValidationError){
            return res.status(400).send({status: false, message : error.message});
         }
        next(error);
    }
}

export const getProductHandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const requestBody:IRBGetProduct = req.body

        const products:Array<IProduct> = await getProductService(requestBody)

        return res.status(200).send({status: true, message: 'Product Details Fetched', data: products})

    } catch (error:any) {
        logger.info(error.message);
        next(error);
    }
}

export const getProductByIdHandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const productId:string = req.params.productId

        const product:IProduct = await getProductByIdService(productId)

        return res.status(200).send({status: true, message: 'Product Details Fetched', data: product})
    } catch (error : any) {
        logger.info(error.message);
        next(error);
    }
}

export const updateProductHandler: RequestHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const productId:string = req.params.productId
        const requestBody:IProductUpdate = req.body
        const image:IFiles = req.files
        
        const updatedPoduct:IProduct = await updatePoductService(productId, requestBody, image)

        return res.status(200).send({status: true, message: 'Product Details updated successfully', data: updatedPoduct})

    } catch (error : any) {
        logger.info(error.message);
        next(error)
    }
}

export const deleteProductHandler: RequestHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const productId:string = req.params.productId

        const deletedProduct:IProduct = await deleteProductService(productId)

        return res.status(200).send({status: true, message: 'Product deleted successfully', data: deletedProduct})

    } catch (error : any) {
        logger.info(error.message);
        next(error)
    }
}