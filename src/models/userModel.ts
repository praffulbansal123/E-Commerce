import {Schema, Document, model} from "mongoose";
import IUser from "../interface/models/user";
import bcrypt from 'bcrypt';
import Locals from "../config/config";
import mongooseUniqueValidator from 'mongoose-unique-validator';

export interface IUserModel extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
}

export const shippingSchema: Schema = new Schema({
    street: {type: String},
    city: {type: String},
    pincode: {type: Number},
}, {_id: false})

export const billingSchema: Schema = new Schema({
    street: {type: String},
    city: {type: String},
    pincode: {type: Number},
}, {_id: false})

export const addressSchema: Schema = new Schema({
    shipping: shippingSchema,
    billing: billingSchema,
}, {_id: false})


export const userSchema : Schema = new Schema({
    fname: {type: String},
    lname: {type: String},
    email: {type: String, unique: true, uniqueCaseInsensitive: true},
    profileImage: {type: String},
    phone: {type: String, unique: true}, 
    password: {type: String},
    address: addressSchema,
}, {timestamps : true})

// password hashing function
userSchema.pre<IUserModel>('save', async function (next) {
    const user = this as IUserModel
    if(!user.isModified('password')) {
        return next();
    }
    try {     
        const salt = bcrypt.genSaltSync(Locals.config().saltRound);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        return next();
    } catch (error : any) {
        return next(error);
    }
});

// compare password function
userSchema.methods.comparePassword = function (requestPassword: string) : any {
    const user = this as IUserModel
    return bcrypt.compare(requestPassword, user.password).catch((error) => false)
};

// unique fields validation
userSchema.plugin(mongooseUniqueValidator, {message: 'already taken'});


// creating model
const User = model<IUserModel>('User', userSchema);

export default User;