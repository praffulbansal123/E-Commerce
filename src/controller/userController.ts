import mongoose, { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';
import { createUser, loginUser, getUserDetails, updateUser } from '../services/userService';
import { IUserModel } from '../models/userModel';
import { JwtPayload } from 'jsonwebtoken';

/*
* @author Prafful Bansal
* @description User registration 
* @route POST user/register
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
export const getUserDetailsHandler = async (req: any, res: Response, next : NextFunction) => {
    try {
        
        const payload: JwtPayload = req.decodedToken
        const userId: Types.ObjectId = req.params.userId

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
export const updateUserDetailsHandler = async (req: any, res: Response, next : NextFunction) => {
    try {
        const userId = req.params.userId
        const requestBody = req.body
        const image = req.files

        const user : IUserModel = await updateUser(requestBody, image, userId)

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