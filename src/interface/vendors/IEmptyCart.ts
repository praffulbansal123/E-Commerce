import { Types } from "mongoose";
import { IAddItems } from "./Items";


export interface IEmptyCart {
    userId: Types.ObjectId,
    items: Array<IAddItems>,
    totalPrice: number,
    totalItems: number,
}