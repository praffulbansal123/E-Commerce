import { Document, Types } from 'mongoose'
import { IAddItems } from '../vendors/Items';

export default interface ICart extends Document{
    userId: Types.ObjectId,
    items:Array<IAddItems>,
    totalPrice: number,
    totalItems: number,
}