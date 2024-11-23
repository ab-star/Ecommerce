export interface OrderRequest{
    name: string,
    email: string,
    mobileNumber: string,
    products: [
        {
            productId: string,
            quantity: number
        }
    ]
}


