import { Document, Types } from 'mongoose'
import { IAddItems } from '../vendors/Items';

export default interface IOrder extends Document{
    userId: Types.ObjectId,
    items:Array<IAddItems>,
    totalPrice: number,
    totalItems: number,
    totalQuantity: number,
    cancellable: boolean,
    status: string,
    deletedAt: Date,
    isDeleted: boolean
}