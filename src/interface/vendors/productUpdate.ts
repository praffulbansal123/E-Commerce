export default interface ProductUpdate{
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