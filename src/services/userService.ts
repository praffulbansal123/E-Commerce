import User, { IUserModel } from '../models/userModel';
import createError from 'http-errors';
import axios from 'axios';
import { uploadFile } from '../providers/aws';

/*
* @author Prafful Bansal
* @description Service for creating new users
*/
export const createUser = async (input: any, image: any) => {
    try {

        // Destructuring address
        const { shipping, billing } = input.address;

        //Matching pincode and city by axios call for shipping
        const options = {
            method: "GET",
            url: `https://api.postalpincode.in/pincode/${shipping.pincode}`,
        };

        const pincodeDetail = await axios(options);

        if (pincodeDetail.data[0].PostOffice === null)
            throw new createError.BadRequest('Invalid pin code provided')

        const cityNameByPinCode = pincodeDetail.data[0].PostOffice[0].District;

        if(cityNameByPinCode !== shipping.city)
            throw new createError.BadRequest(`Invalid shipping address as ${shipping.pincode} does not matches ${shipping.city}`)
        
        // Checking if shipping and billing address are same
        if(shipping.street !== billing.street || shipping.city !== billing.city || shipping.pincode !== billing.pincode){

            //Matching pincode and city by axios call for billing
            const options = {
                method: "GET",
                url: `https://api.postalpincode.in/pincode/${billing.pincode}`,
            };

            const pincodeDetail = await axios(options);

            if (pincodeDetail.data[0].PostOffice === null)
                throw new createError.BadRequest('Invalid pin code provided')

            const cityNameByPinCode = pincodeDetail.data[0].PostOffice[0].District;

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
        input.profileImage = profileImage

        // Creating user
        const user : IUserModel = await User.create(input)

        // masking password 
        // user.password = undefined;

        return user
    } catch (error : any) {
      throw error
    }
}