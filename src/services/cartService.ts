import IProduct from "../interface/models/product"
import { IItems } from "../interface/vendors/IItems"
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