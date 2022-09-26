import IProduct from "../interface/models/product"
import { CartUpdate, IItems } from "../interface/vendors/IItems"
import Product from "../models/productModel"
import createError from 'http-errors';
import ICart from "../interface/models/cart";
import Cart from "../models/cartModel";

export const addProductToCartService = async (userId: string, productInfo: IItems): Promise<ICart> => {
    try {
        // Checking for the valid productId
        const productById:IProduct|null = await Product.findById({_id: productInfo.productId, isDeleted: false})

        if(!productById)
            throw new createError.BadRequest(`No productById exits with ID: ${productInfo.productId} or it has been deleted`)
        
        // Checking cart validation for given userId
        const cartByUserID:ICart|null = await Cart.findOne({userId: userId})

        if(!cartByUserID)
            throw new createError.BadRequest(`No cart exits for user with ID: ${userId}`)

        const update:CartUpdate = {}
        
        // Adding product to cart
        cartByUserID.items.push(productInfo)
        update.items = cartByUserID.items
        
        // Updating cart totalPrice
        update.totalPrice = cartByUserID.totalPrice + (productById.price * productInfo.quantity)

        // Updating cart totalItems
        update.totalItems = cartByUserID.totalItems + 1

        const updatedCart = await Cart.findOneAndUpdate({userId: userId}, {$set: update}, {new: true}) as ICart

        return updatedCart
        
    } catch (error : any) {
        throw error
    }
}