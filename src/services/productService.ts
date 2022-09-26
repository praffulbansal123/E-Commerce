import Product from '../models/productModel';
import IProduct from "../interface/models/product"
import createError from 'http-errors';
import { uploadFile } from '../providers/aws';
import {Types} from 'mongoose';
import ProductUpdate from '../interface/vendors/productUpdate';
import { IFiles } from '../interface/vendors/files';

export const createProductService = async (input: IProduct, image: IFiles) => {
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
        const product: IProduct = await Product.create(input)

        return product
    } catch (error:any) {
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
        let products
        if(input.priceSort){
            products = await Product.find(filterCondition).sort({price: input.priceSort})
        } else {
            products = await Product.find(filterCondition)
        }
        if(products.length === 0)
            throw new createError.NotFound('No products found with the given filterCondition')

        return products

    } catch (error:any) {
        throw error
    }
}

export const getProductByIdService = async (input: string): Promise<IProduct> => {
    try {
        if(!Types.ObjectId.isValid(input))
            throw new createError.BadRequest('Please provide a valid input ID')
        
        const product = await Product.findById({ _id: input, isDeleted: false}) as IProduct

        if(!product)
            throw new createError.NotFound(`No product exits with ID: ${input} or it has been deleted`)

        return product
    } catch (error:any) {
        throw error
    }
}

export const updatePoductService = async (productId:string, requestBody:ProductUpdate, image:IFiles): Promise<IProduct> => {
    try {
        if(!Types.ObjectId.isValid(productId))
            throw new createError.BadRequest('Please provide a valid input ID')

        const updates: ProductUpdate = {}

        
        const product = await Product.findById({_id: productId, isDeleted: false})
        
        if(!product)
            throw new createError.BadRequest(`No product exits with ID: ${productId}`)

        if(image && image.length>0){
            // Regex for validating image
            const regexForMimeTypes = /image\/png|image\/jpeg|image\/jpg/;

            // Validating image format
            if(!regexForMimeTypes.test(image[0].mimetype))
                throw new createError.BadRequest('Invalid image format')
        
            // Uploading profile image to AWS_S3
            const productImage = await uploadFile(image[0])

            updates.productImage = productImage as string
        }

        const {title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments} = requestBody
        
        if(title){
            if(title === product.title)
                throw new createError.BadRequest('Title of the product is already upto date')
                
                const isNotUniqueTitle: IProduct | null = await Product.findOne({title: title})

            if(isNotUniqueTitle)
                throw new createError.BadRequest('Please provide a unique title to update')

            updates.title = title
        }

        if(description && description !== product.description)
            updates.description = description
        
        if(price && price !== product.price)
            updates.price = price
        
        if(currencyId && currencyId !== product.currencyId)
            updates.currencyId = currencyId
        
        if(currencyFormat && currencyFormat !== product.currencyFormat)
            updates.currencyFormat = currencyFormat
        
        if(isFreeShipping && isFreeShipping !== product.isFreeShipping)
            updates.isFreeShipping = isFreeShipping
        
        if(style && style !== product.style)
            updates.style = style
        
        if(availableSizes && availableSizes !== product.availableSizes)
            updates.availableSizes = availableSizes

        if(installments && installments !== product.installments)
            updates.installments = installments

        if(Object.keys(updates).length === 0)
            throw new createError.BadRequest("Nothing to update")
        
        const updatedProduct = await Product.findByIdAndUpdate({ _id: productId}, { $set: updates }, { new: true }) as IProduct

        return updatedProduct

    } catch (error : any) {
        throw error
    }
}

export const deleteProductService = async (input: string): Promise<IProduct> => {
    try {
        if(!Types.ObjectId.isValid(input))
            throw new createError.BadRequest('Please provide a valid input ID')
        
        const product:IProduct|null = await Product.findById({ _id: input, isDeleted: false})

        if(!product)
            throw new createError.NotFound(`No product exits with ID: ${input} or it has been deleted`)

        const deletedProduct = await Product.findByIdAndUpdate({ _id: input}, {$set : {isDeleted: true, deletedAt: Date.now()}}, {new: true}) as IProduct

        return deletedProduct

    } catch (error : any) {
        throw error
    }
}