import IProduct from "../interface/models/product"
import { IAddItems, IRemoveItems } from "../interface/vendors/Items"
import Product from "../models/productModel"
import createError from 'http-errors';
import ICart from "../interface/models/cart";
import Cart from "../models/cartModel";
import { Types } from "mongoose";

export const addProductToCartService = async (userId:string, productInfo:IAddItems):Promise<ICart> => {
    try {
        // Checking for the valid productId
        const productById:IProduct|null = await Product.findOne({_id: productInfo.productId, isDeleted: false})

        if(!productById)
            throw new createError.BadRequest(`No productById exits with ID: ${productInfo.productId} or it has been deleted`)
        
        // Checking cart validation for given userId
        const cartByUserID:ICart|null = await Cart.findOne({userId: userId})

        if(!cartByUserID)
            throw new createError.BadRequest(`No cart exits for user with ID: ${userId}`)
        
        // checking whether product exist in cart or not
        const isProductExistsInCart = cartByUserID.items.filter(
            (productData) => productData.productId.toString() === productInfo.productId.toString()
        );

        if(isProductExistsInCart.length>0){

            const updatedCart = await Cart.findOneAndUpdate({userId: userId, "items.productId": productInfo.productId},{$inc: {totalPrice: (productById.price * productInfo.quantity), "items.$.quantity": productInfo.quantity}}, {new: true}) as ICart
            
            return updatedCart

        } else {
            const updatedCart = await Cart.findOneAndUpdate({userId: userId}, {$addToSet: {items: productInfo}, $inc: {totalPrice: (productById.price * productInfo.quantity), totalItems: 1}}, {new: true}) as ICart
            
            return updatedCart
        }
        
    } catch (error : any) {
        throw error
    }
}

export const removeProductFromCartService = async (userId:string, productInfo:IRemoveItems):Promise<ICart> => {
    try {
        
        // Checking for the valid productId
        const productById:IProduct|null = await Product.findById({_id: productInfo.productId, isDeleted: false})

        if(!productById)
            throw new createError.BadRequest(`No Product exits with ID: ${productInfo.productId} or it has been deleted`)
        
        // Checking cart validation for given userId
        const cartByUserID:ICart|null = await Cart.findOne({userId: userId})

        if(!cartByUserID)
            throw new createError.BadRequest(`No cart exits for user with ID: ${userId}`)

        // checking whether product exist in cart or not
        const isProductExistsInCart = cartByUserID.items.filter(
            (productData) => productData.productId.toString() === productInfo.productId.toString()
        );

        if(isProductExistsInCart.length === 0)
            throw new createError.BadRequest(`No product exists in cart with ID: ${productInfo.productId}`)

        // Getting the quantity of the product
        const productQuantity = isProductExistsInCart[0].quantity

        // Decreasing the quantity of the product
        if(productQuantity>1 && productInfo.removeProduct === 1){
           
            const updatedCart = await Cart.findOneAndUpdate({userId: userId, "items.productId": productInfo.productId}, {$inc: {totalPrice: -productById.price, "items.$.quantity": -1 }}, {new: true}) as ICart

            return updatedCart

        }
        // Erasing the product from cart as product quantity is 1 
        else if(productQuantity === 1 && productInfo.removeProduct === 1){

            const updatedCart = await Cart.findOneAndUpdate({userId: userId}, {$pull: {items: isProductExistsInCart[0]}, $inc: {totalItems: -1, totalPrice: -productById.price}}, {new: true}) as ICart

            return updatedCart

        }
        // Deleting the whole product from cart 
        else {
            const updatedCart = await Cart.findOneAndUpdate({userId: userId}, {$pull: {items: isProductExistsInCart[0]}, $inc: {totalItems: -1, totalPrice: -(productById.price * productQuantity)}}, {new: true}) as ICart

            return updatedCart
        }
    } catch (error: any) {
        throw error
    }
}

export const getCartDetailsService = async (input:string):Promise<ICart> => {
    try {
        // Validating userId
        if(!Types.ObjectId.isValid(input))
            throw new createError.BadRequest('Please provide a valid user ID')
        
        // Checking cart validation for given userId
        const cartByUserID:ICart|null = await Cart.findOne({userId: input})

        if(!cartByUserID)
            throw new createError.BadRequest(`No cart exits for user with ID: ${input}`)

        return cartByUserID

    } catch (error : any) {
        throw error
    }
}

export const emptyCartService = async (input:string):Promise<ICart> => {
    try {
        // Validating userId
        if(!Types.ObjectId.isValid(input))
            throw new createError.BadRequest('Please provide a valid user ID')
        
        // Checking cart validation for given userId
        const cartByUserID:ICart|null = await Cart.findOne({userId: input})

        if(!cartByUserID)
            throw new createError.BadRequest(`No cart exits for user with ID: ${input}`)

        if(cartByUserID.items.length === 0)
            throw new createError.BadRequest('Cart is already empty')

        // Updating cart details
        const emptyCart = await Cart.findOneAndUpdate({userId: input}, {$set: {items: [], totalPrice: 0, totalItems: 0}}, {new: true}) as ICart

        return emptyCart

    } catch (error : any) {
        throw error
    }
}