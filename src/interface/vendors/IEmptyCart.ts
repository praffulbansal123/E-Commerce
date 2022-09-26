import { Types } from "mongoose";
import { IItems } from "./IItems";


export interface IEmptyCart {
    userId: Types.ObjectId,
    items: Array<IItems>,
    totalPrice: number,
    totalItems: number,
}