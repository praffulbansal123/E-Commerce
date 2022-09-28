import { Request, Response, NextFunction, RequestHandler } from "express";
import IOrder from "../interface/models/order";
import { IRBOrder, IStatusOrder } from "../interface/vendors/order";
import logger from "../logger/logger"
import { createOrderService, orderStatusService } from "../services/orderService";



export const createOrderhandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const userId:string = req.params.userId
        const requestBody:IRBOrder = req.body

        const order:IOrder = await createOrderService(userId, requestBody)

        return res.status(200).send({status: true, message: 'Order created successfully', data: order})

    } catch (error:any) {
        logger.info(error.message);
        next(error)
    }
}

export const orderStatusHandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {

        const userId:string = req.params.userId
        const orderId:string = req.params.orderId
        const requestBody:IStatusOrder = req.body

        const updatedOrder:IOrder = await orderStatusService(userId, orderId, requestBody)

        return res.status(200).send({status: true, message: 'Order status updated successfully', data: updatedOrder})
        
    } catch (error:any) {
        logger.info(error.message);
        next(error)
    }
}