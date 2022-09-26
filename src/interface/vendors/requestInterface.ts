import { Request } from 'express'
import { Session, SessionData } from "express-session";
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { IUserModel } from  '../../models/userModel'


export default interface IRequest extends Request {
    decodedToken?: JwtPayload;
    userId?: String;
};