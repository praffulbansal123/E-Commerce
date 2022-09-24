import Product from '../models/productModel';
import IProduct from "../interface/product"
import createError from 'http-errors';
import { uploadFile } from '../providers/aws';

export const createProductService = async (input: IProduct, image: any) => {
    try {
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
        const productImage = await uploadFile(image[0])
        
        // Adding profileImage link 
        input.productImage = productImage as string

        // Creating product
        const product : IProduct = await Product.create(input)

        return product
    } catch (error) {
        throw error
    }
}

export const getProductService = async (input: any) => {
    try {
        const filterCondition: any = {isDeleted: false, deletedAt: null}

        if(input.size){
            filterCondition.availableSizes = {$in: input.size}
        }
        if(input.priceLessThan && !input.priceGreaterThan){
            filterCondition.price = {$lt: input.priceLessThan}
        }
        if(!input.priceLessThan && input.priceGreaterThan){
            filterCondition.price = {$gt: input.priceGreaterThan}
        }
        if(input.priceLessThan && input.priceGreaterThan){
            filterCondition.price = {$lt: input.priceLessThan, $gt: input.priceGreaterThan}
        }
        if(input.name){
            filterCondition.title = input
        }
        console.log(filterCondition)
        let products
        if(input.priceSort){
            products = await Product.find(filterCondition).sort({price: input.priceSort})
        } else {
            products = await Product.find(filterCondition)
        }
        if(products.length === 0)
            throw new createError.NotFound('No products found with the given filterCondition')

        return products

    } catch (error) {
        throw error
    }
}