import {Schema, Document, model} from "mongoose";
import IUser from "../interface/user";
import bcrypt from 'bcrypt';
import Locals from "../config/config";
import mongooseUniqueValidator from 'mongoose-unique-validator';

export interface IUserModel extends IUser, Document {
    comparePassword(password: string, cb : any): string;
}


export const userSchema : Schema = new Schema({
    fname: {type: String},
    lname: {type: String},
    email: {type: String, unique: true, uniqueCaseInsensitive: true},
    profileImage: {type: String},
    phone: {type: String, unique: true}, 
    password: {type: String},
    address: {
        shipping: {
            street: {type: String},
            city: {type: String},
            pincode: {type: Number},
        },
        billing: {
            street: {type: String},
            city: {type: String},
            pincode: {type: String},
        }
    },
}, {timestamps : true})

// password hashing function
userSchema.pre<IUserModel>('save', async function (next) {
    const user = this;
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
userSchema.methods.comparePassword = function (requestPassword: string, cb : any) : any {
    bcrypt.compare(requestPassword, this.password, (err, isMatch) => {
        return cb(err, isMatch);
    })
};

// unique fields validation
userSchema.plugin(mongooseUniqueValidator, {message: 'already taken'});


// creating model
const User = model<IUserModel>('User', userSchema);

export default User;