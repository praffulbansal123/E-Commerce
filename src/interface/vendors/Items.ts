import { Types } from "mongoose";

export type IAddItems = {
    productId: Types.ObjectId,
    quantity: number
}

export type IRemoveItems = {
    productId: Types.ObjectId,
    removeProduct: number
}