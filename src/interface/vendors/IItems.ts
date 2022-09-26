import { Types } from "mongoose";

export type IItems = {
    productId: Types.ObjectId,
    quantity: number
}

export type CartUpdate = {
    items?: Array<IItems>,
    totalPrice?: number,
    totalItems?: number
}