import { Document } from 'mongoose'

export default interface IProduct extends Document{
    title: string,
    description: string,
    price: number,
    currencyId: string,
    currencyFormat: string,
    isFreeShipping: boolean,
    productImage: string,
    style: string,
    availableSizes: [string],
    installments: number,
    deletedAt: Date,
    isDeleted: boolean,
}