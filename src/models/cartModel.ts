import {Schema, model, Types} from "mongoose";
import ICart from "../interface/models/cart"
import mongooseUniqueValidator from "mongoose-unique-validator";

export const productInfoSchema: Schema = new Schema({
    productId: {type: Types.ObjectId, ref: 'Product'},
    quantity: {type: Number}
},{_id: false})

export const cartSchema : Schema = new Schema({
    userId: {type: Types.ObjectId, unique: true, ref: 'User'},
    items: [productInfoSchema],
    totalPrice: {type: Number},
    totalItems: {type: Number},
},{timestamps: true})

// unique fields validation
cartSchema.plugin(mongooseUniqueValidator, {message: 'already taken'});


// creating model
const Cart = model<ICart>('Cart', cartSchema);

export default Cart;