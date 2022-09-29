import { SortOrder } from "mongoose"

export interface IProductUpdate{
    title?: string,
    description?: string,
    price?: number,
    currencyId?: string,
    currencyFormat?: string,
    isFreeShipping?: boolean,
    productImage?: string,
    style?: string,
    availableSizes?: [string],
    installments?: number
}

export interface IRBGetProduct{
    name?: string,
    size?: Array<string>,
    priceLessThan?: number,
    priceGreaterThan?: number,
    priceSort?: SortOrder
}

export interface IFilterCondition{
    isDeleted: boolean,
    deletedAt: null,
    title?: string,
    availableSizes?: {
        $in: Array<string>
    },
    price?: {
        $gt?: number,
        $lt?: number
    }
}

export interface IRBCreateProduct{
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
