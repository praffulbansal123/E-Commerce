import {Schema, model, Types} from "mongoose";
import IOrder from "../interface/models/order";

export const productInfoSchema: Schema = new Schema({
    productId: {type: Types.ObjectId, ref: 'Product'},
    quantity: {type: Number}
},{_id: false})

export const orderSchema : Schema = new Schema({
    userId: {type: Types.ObjectId, ref: 'User'},
    items: [productInfoSchema],
    totalPrice: {type: Number},
    totalItems: {type: Number},
    totalQuantity: {type: Number},
    cancellable: {type: Boolean},
    status: {type: String},
    deletedAt: {type: Date},
    isDeleted: {type: Boolean},
},{timestamps: true})

// creating model
const Order = model<IOrder>('Order', orderSchema);

export default Order;