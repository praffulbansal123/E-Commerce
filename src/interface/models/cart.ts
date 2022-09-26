import { Document, Types } from 'mongoose'
import { IItems } from '../vendors/IItems';

export default interface ICart extends Document{
    userId: Types.ObjectId,
    items:Array<IItems>,
    totalPrice: number,
    totalItems: number,
}