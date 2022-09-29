import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken';

export interface IRequest extends Request {
    decodedToken?: JwtPayload;
    userId?: String;
};

export interface IUserUpdate {
    fname?: string,
    lname?: string,
    email?: string,
    profileImage?: string,
    phone?: string,
    password?: string,
    address?: {
        shipping?: {
            street: string,
            city: string,
            pincode: number
        },
        billing?: {
            street: string,
            city: string,
            pincode: number
        }
    }
}