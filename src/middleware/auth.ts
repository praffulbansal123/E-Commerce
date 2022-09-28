import createError from "http-errors";
import logger from "../logger/logger";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction } from "express";
import Locals from "../config/config";

/*
* @author Prafful Bansal
* @description AuthMiddleware 
*/
export const authentication = async (req: any, res: any, next: NextFunction) => {

    try {

        let token: string = req.headers["authorization"];

        if (!token || token.split(" ")[0] !== 'Bearer')
            throw new createError.Unauthorized("Token is required...please login first.");

        token = token.split(" ")[1];

        const decodedToken: string | JwtPayload = jwt.verify(token, Locals.config().jwtSecret);

        req.decodedToken = decodedToken

        next()

    } catch (error: any) {
        logger.info(error.message);
        error.status = 401
        next(error)
    }
}

export const authorizationByUserID = async (req: any, res: any, next: NextFunction) => {
    try {
        const decodedToken = req.decodedToken;
        const userId = req.params.userId;
  
        if(decodedToken.userId !== userId)
            throw new createError.Forbidden("Unauthorized access");
      
        next();
    } catch (error: any) {
        logger.info(error.message);
        next(error)
    }
};