import { Console } from "console";
import { Request, Response, NextFunction, RequestHandler } from "express";
import ICart from "../interface/models/cart";
import { IAddItems, IRemoveItems } from "../interface/vendors/Items";
import logger from "../logger/logger";
import {addProductToCartService, removeProductFromCartService, getCartDetailsService, emptyCartService} from "../services/cartService"


export const addProductToCarthandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const userId:string = req.params.userId;
        const productInfo:IAddItems = req.body;

        const updatedCart:ICart = await addProductToCartService(userId, productInfo)

        return res.status(201).send({status: true, message: 'Product added to cart successfully', data: updatedCart})
        
    } catch (error : any) {
        logger.info(error.message);
        next(error)
    }
}

export const removeProductFromCartHandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const userId:string = req.params.userId;
        const productInfo:IRemoveItems = req.body;

        const updatedCart:ICart = await removeProductFromCartService(userId, productInfo)

        return res.status(200).send({status: true, message: 'Product removed from cart successfully', data: updatedCart})

    } catch (error : any) {
        logger.info(error.message);
        next(error)
    }
}

export const getCartDetailsHandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {
        
        const userId:string = req.params.userId;

        const cartDetails:ICart = await getCartDetailsService(userId)

        return res.status(200).send({status: true, message: 'Cart details fetched successfully', data: cartDetails})

    } catch (error : any) {
        logger.info(error.message);
        next(error)
    }
}

export const emptyCartHandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {

        const userId:string = req.params.userId;

        const emptyCart:ICart = await emptyCartService(userId)

        return res.status(200).send({status: true, message: 'Cart emptied successfully', data: emptyCart})
        
    } catch (error : any) {
        logger.info(error.message);
        next(error)
    }
}