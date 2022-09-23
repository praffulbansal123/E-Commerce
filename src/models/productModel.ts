import {Schema, model} from "mongoose";
import IProduct from "../interface/product"
import mongooseUniqueValidator from "mongoose-unique-validator";

export const productSchema : Schema = new Schema({
    title: {type: String, unique: true},
    description: {type: String},
    price: {type: Number},
    currencyId: {type: String},
    currencyFormat: {type: String},
    isFreeShipping: {type: Boolean},
    productImage: {type: String},
    style: {type: String},
    availableSizes: {type: [String]},
    installments: {type: Number},
    deletedAt: {type: Date}, 
    isDeleted: {type: Boolean},
}, {timestamps: true})

// unique fields validation
productSchema.plugin(mongooseUniqueValidator, {message: 'already taken'});

// creating model
const Product = model<IProduct>('Product', productSchema);

export default Product;