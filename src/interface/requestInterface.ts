import { Request } from 'express'
import { Session } from "express-session";
import {IUserModel} from  '../models/userModel'


export interface IRequest extends Request {
    user?: IUserModel;
};