import User, { IUserModel } from '../models/userModel';
import createError from 'http-errors';
import axios from 'axios';
import { uploadFile } from '../providers/aws';
import bcrypt from 'bcrypt'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import Locals from '../config/config';
import {omit} from 'lodash'
import IUser from '../interface/models/user'
import { IFiles } from '../interface/vendors/files';
import Cart from '../models/cartModel';
import ICart from '../interface/models/cart';
import {IEmptyCart} from '../interface/vendors/IEmptyCart'
import { IUserUpdate } from '../interface/vendors/user';

/*
* @author Prafful Bansal
* @description Service for creating new users
*/
const validatePincode = async (input:number):Promise<string> => {
    try {
        const options = {
            method: "GET",
            url: `https://api.postalpincode.in/pincode/${input}`,
        };
        
        const pincodeDetail = await axios(options);

        if (pincodeDetail.data[0].PostOffice === null)
                throw new createError.BadRequest('Invalid pin code provided')
        
        const cityNameByPinCode:string = pincodeDetail.data[0].PostOffice[0].District;
    
        return cityNameByPinCode
    } catch (error: any) {
        throw error
    }
}

export const createUser = async (input:IUser, image:IFiles):Promise<any> => {
    try {

        // Destructuring address
        const { shipping, billing } = input.address;

        const cityNameByPinCode = await validatePincode(shipping.pincode)
        
        if(cityNameByPinCode !== shipping.city)
            throw new createError.BadRequest(`Invalid shipping address as ${shipping.pincode} does not matches ${shipping.city}`)

        // Checking if shipping and billing address are same
        if(shipping.street !== billing.street || shipping.city !== billing.city || shipping.pincode !== billing.pincode){

            const cityNameByPinCode = await validatePincode(billing.pincode)

            if(cityNameByPinCode !== billing.city)
                throw new createError.BadRequest(`Invalid billing address as ${billing.pincode} does not matches ${billing.city}`)
        } 
        
        // Checking for profile image
        if(image.length === 0 || !image)
            throw new createError.BadRequest("Profile Image is required");

        if(image.length>=2)
            throw new createError.BadRequest("Only one profile picture is allowed")
        
        // Regex for validating image
        const regexForMimeTypes = /image\/png|image\/jpeg|image\/jpg/;
        
        // Validating image format
        if(!regexForMimeTypes.test(image[0].mimetype))
            throw new createError.BadRequest('Invalid image format')
        
        // Uploading profile image to AWS_S3
        const profileImage = await uploadFile(image[0])
        
        // Adding profileImage link 
        input.profileImage = profileImage as string

        // Creating user
        const user:IUserModel = await User.create(input)

        // Creating cart for individual user
        const newCartData:IEmptyCart = {
            userId: user._id,
            items: [],
            totalPrice: 0,
            totalItems: 0
        }

        const newCart:ICart = await Cart.create(newCartData)

        return omit(user.toJSON(), "password")
    } catch (error : any) {
      throw error
    }
}

/*
* @author Prafful Bansal
* @description Service for login
*/
export const loginUser = async (input: any) : Promise<any> => {

    try {
        
        const user : any = await User.findOne({email: input.email});

        if(!user){
            throw new createError.NotFound(`${input.email} does not exist`);
        }

        // comparing password
        const isPasswordMatch = await user.comparePassword(input.password);

        if(!isPasswordMatch){
            throw new createError.NotAcceptable('Invalid Password')
        }

        // JWT logic
        const payload: JwtPayload = {
            userId : user._id.toString() as string
        }
    
        const secret: string = Locals.config().jwtSecret
        const expiry: SignOptions | undefined = {expiresIn : Locals.config().jwtExpiration as string}
    
        const token: string = jwt.sign(payload, secret, expiry)
        
        const obj = {token: token, user : omit(user.toJSON(), "password") as IUserModel}

        return obj

    } catch (error : any) {
        throw error
    }
    
}

/*
* @author Prafful Bansal
* @description Service for getting user details
*/
export const getUserDetails = async (input:string, payload:JwtPayload):Promise<any> => {
    try {
        if(input !== payload.userId)
            throw new createError.Unauthorized('User is not authorized for this resource')
        
        const user = await User.findById(input) as IUserModel

        if(!user)
            throw new createError.BadRequest(`No user exits with ID: ${input}`)
        
        return omit(user.toJSON(), "password")

    } catch (error : any) {
        throw error
    }
}

/*
* @author Prafful Bansal
* @description Service for updating user details
*/
export const updateUser = async (requestBody:IUserUpdate, image:IFiles, userId:String):Promise<any> => {
    try {
        const updates:any = {}

        const user = await User.findById(userId)

        if(!user)
            throw new createError.BadRequest(`No user exits with ID: ${userId}`)
        
        if(image.length>=2)
            throw new createError.BadRequest("Only one profile picture is allowed")
        
        if(image.length>0){
            // Regex for validating image
            const regexForMimeTypes = /image\/png|image\/jpeg|image\/jpg/;
        
            // Validating image format
            if(!regexForMimeTypes.test(image[0].mimetype))
                throw new createError.BadRequest('Invalid image format')
        
            // Uploading profile image to AWS_S3
            const profileImage = await uploadFile(image[0]) as string

            updates.profileImage = profileImage
        }

        const {fname, lname, email, phone, password, address} = requestBody

        if(fname){
            if(fname !== user.fname)
                updates.fname = fname
            
            else throw new createError.BadRequest(`Provide a new first name as ${fname} is already upto date`)   
        }
        
        if(lname && lname !== user.lname)
            updates.lname = lname
        
        if(email && email !== user.email){
            const notUniqueEmail = await User.findOne({email: email})

            if(notUniqueEmail)
                throw new createError.BadRequest(`Please provide another email as email: ${email} already exits`)

            updates.email = email
        }

        if(phone && phone !== user.phone){
            const notUniquePhone = await User.findOne({phone: phone})

            if(notUniquePhone)
                throw new createError.BadRequest(`Please provide another phone as phone: ${phone} already exits`)

            updates.phone = phone
        }

        if(password){
            const compareOldPassword = await bcrypt.compare(password, user.password)

            if(compareOldPassword)
                throw new createError.BadRequest('Can not update same password')

            const salt = bcrypt.genSaltSync(Locals.config().saltRound);
            const hashedPassword = await bcrypt.hash(password, salt)

            updates.password = hashedPassword
        }

        if(address){
            const {shipping, billing} = address
            if(shipping){
                const { street, city, pincode } = shipping
                
                if(street) updates["address.shipping.street"] = street
                
                if(pincode === user.address.shipping.pincode)
                    throw new createError.BadRequest('Can not update old pincode')

                const cityNameByPinCode = await validatePincode(pincode)

                if(cityNameByPinCode !== city)
                throw new createError.BadRequest(`Invalid billing address as ${pincode} does not matches ${city}`)
                
                updates["address.shipping.city"] = cityNameByPinCode
                updates["address.shipping.pincode"] = pincode
            }
            if(billing){
                const { street, city, pincode } = billing

                console.log(street, city, pincode)
                if(street) 
                    updates["address.billing.street"] = street
                   
                if(pincode === user.address.billing.pincode)
                    throw new createError.BadRequest('Can not update old pincode')

                const cityNameByPinCode = await validatePincode(pincode)

                if(cityNameByPinCode !== city)
                    throw new createError.BadRequest(`Invalid billing address as ${pincode} does not matches ${city}`)
                
                updates["address.billing.city"] = cityNameByPinCode
                updates["address.billing.pincode"] = pincode
            }
        }

        if(Object.keys(updates).length === 0)
            throw new createError.BadRequest("Nothing to update")

        const updatedProfile = await User.findByIdAndUpdate({ _id: userId }, { $set: updates }, { new: true }) as IUserModel;

        return omit(updatedProfile.toJSON(), "password")
        
    } catch (error : any) {
        throw error
    }
}