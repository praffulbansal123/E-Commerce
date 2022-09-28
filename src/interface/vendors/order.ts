import { Types } from "mongoose"
import { IAddItems } from "./Items"

export interface IRBOrder {
    cancellable: boolean,
    status: string,
    deletedAt: Date,
    isDeleted: boolean 
}

export interface ICreateOrder {
    userId: Types.ObjectId
    items: Array<IAddItems>,
    totalPrice: number,
    totalItems: number,
    totalQuantity: number,
    cancellable: boolean,
    status: string,
    deletedAt: Date,
    isDeleted: boolean
}

export interface IStatusOrder {
    status: string
}