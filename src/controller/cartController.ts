import { Request, Response, NextFunction, RequestHandler } from "express";
import ICart from "../interface/models/cart";
import { IItems } from "../interface/vendors/IItems";
import logger from "../logger/logger";
import {addProductToCartService} from "../services/cartService"


export const addProductToCarthandler:RequestHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const userId:string = req.params.userId;
        const productInfo:IItems = req.body;

        const cart:ICart = await addProductToCartService(userId, productInfo)

        return res.status(200).send({status: true, message: 'Product added to cart successfully', data: cart})
        
    } catch (error : any) {
        logger.info(error.message);
        next(error)
    }
}