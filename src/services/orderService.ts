import IOrder from "../interface/models/order";
import IProduct from "../interface/models/product";
import ICart from "../interface/models/cart";
import { ICreateOrder, IRBOrder } from "../interface/vendors/order";
import Cart from "../models/cartModel";
import Product from "../models/productModel";
import Order from "../models/orderModel";
import createError from 'http-errors';

export const createOrderService = async (input:string, requestBody:IRBOrder): Promise<IOrder> => {
    try {
        // Destructuring requestBody
        const {cancellable, status, deletedAt, isDeleted} = requestBody

        // Getting user cart details from userId
        const userCart:ICart|null = await Cart.findOne({userId: input}).select({items: 1, userId: 1, totalItems: 1,totalPrice: 1})

        if(!userCart)
            throw new createError.BadRequest(`No cart exits for user with ID: ${input}`)
        
        // Checking if the cart is empty or not
        if(userCart.items.length === 0)
            throw new createError.BadRequest(`User cart is empty`)

        // Total product quantity in the cart
        const totalQuantity = userCart.items.reduce((acc,curr) => {
            acc += curr.quantity
            return acc
        }, 0)

        // Checking if all products in the cart are available or not
        for(let ele of userCart.items){
            const productDetails = await Product.findById(ele.productId) as IProduct

            if(productDetails.installments < ele.quantity)
                throw new createError.BadRequest(`Product with ID: ${ele.productId} is out of stock`)
        }
        console.log(userCart.userId)

        const orderData:ICreateOrder = {
            userId: userCart.userId,
            items: userCart.items,
            totalItems: userCart.totalItems,
            totalPrice: userCart.totalPrice,
            totalQuantity: totalQuantity,
            cancellable: cancellable,
            status: status,
            deletedAt: deletedAt,
            isDeleted: isDeleted,
        }

        // Creating Order
        const order:IOrder = await Order.create(orderData)

        // Updating product stock
        for(let ele of userCart.items){
            const updatedProduct = await Product.findByIdAndUpdate({ _id:ele.productId}, {$inc: {installments: -ele.quantity}}, {new: true})
        }

        // Making cart empty again
        const makeCartEmpty = await Cart.findOneAndUpdate({userId: input}, {$set: {items: [], totalPrice: 0, totalItems: 0}}, {new: true});
        
        return order
        
    } catch (error) {
        throw error
    }
}