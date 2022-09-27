import { Types } from "mongoose";

export type IItems = {
    productId: Types.ObjectId,
    quantity: number
}