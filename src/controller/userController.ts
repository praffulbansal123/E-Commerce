import mongoose, { Types } from 'mongoose';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import logger from '../logger/logger';
import { createUser, loginUser, getUserDetails, updateUser } from '../services/userService';
import { IUserModel } from '../models/userModel';
import { JwtPayload } from 'jsonwebtoken';
import { IFiles } from '../interface/vendors/files';
import IUser from '../interface/models/user';
import { IRequest, IUserUpdate } from '../interface/vendors/user';

/*
* @author Prafful Bansal
* @description User registration 
* @route POST user/register
*/
export const createUserHandler:RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try {

        const requestBody:IUser = req.body
        const image:IFiles = req.files

        const user:IUser = await createUser(requestBody, image);
    
        return res.status(201).send({status: true, message: 'New User successfully registered', data: user});
        
    } catch (error: any) {
        logger.info(error.message);
        if(error instanceof mongoose.Error.ValidationError){
           return res.status(400).send({status: false, message : error.message});
        }
        next(error);
    }
}

/*
* @author Prafful Bansal
* @description User login 
* @route POST user/login
*/
export const loginHandler = async (req: any, res: any, next: NextFunction): Promise<void> => {

    try {
        const login = await loginUser(req.body);

        req.session.user = login.user;

        res.header('Authorization', 'Bearer ' + login.token)

        return res.status(200).send({status: true, message: 'User Login Successfull', data: {user: login.user._id, token: login.token}})
       
    } catch (error : any) {
        logger.info(error.message);
        next(error);
    }
}

/*
* @author Prafful Bansal
* @description User login 
* @route GET user/getUserDetails/:userId
*/
export const getUserDetailsHandler: RequestHandler = async (req: IRequest, res: Response, next : NextFunction) => {
    try {
        
        const payload = req.decodedToken as JwtPayload
        const userId: string = req.params.userId

        console.log(payload, userId)

        const user = await getUserDetails(userId, payload)

        return res.status(200).send({status: true, message: 'User profile details fecthed', data: user})

    } catch (error : any) {
        logger.info(error.message);
        next(error);
    }
}

/*
* @author Prafful Bansal
* @description User login 
* @route GET user/updateUser/:userId
*/
export const updateUserDetailsHandler: RequestHandler = async (req: IRequest, res: Response, next : NextFunction) => {
    try {
        const userId:string = req.params.userId
        const requestBody:IUserUpdate = req.body
        const image:IFiles = req.files

        const user:IUserModel = await updateUser(requestBody, image, userId)

        return res.status(200).send({status: true, message: 'User details updated Successfully', data: user})

    } catch (error : any) {
        logger.info(error.message);
        next(error);
    }
}

/*
* @author Prafful Bansal
* @description User logout 
* @route GET  /user/logout
*/
export const logoutHandler =  async (req : any, res : Response, next : NextFunction) => {
    req.session.destroy((err : Error) => {
        if(err) {
            throw new Error(err.message);
        }
    });
   return res.clearCookie("connect.sid").end("logout success");
}