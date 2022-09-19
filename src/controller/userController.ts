import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';
import { createUser } from '../services/userService';
import { IUserModel } from '../models/userModel';

/*
* @author Prafful Bansal
* @description register user handler function
*/
export const createUserHandler = async (req: Request, res: Response, next : NextFunction): Promise<any> => {
    try {

        const requestBody = req.body
        const image = req.files

        const user: IUserModel = await createUser(requestBody, image);
    
        return res.status(201).send({status: true, message: 'New User successfully registered', data: user});
        
    } catch (error: any) {
        logger.info(error.message);
        if(error instanceof mongoose.Error.ValidationError){
           return res.status(400).send({status: false, message : error.message});
        }
        next(error);
    }
}