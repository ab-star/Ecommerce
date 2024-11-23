export interface Product{
    id: number;
    name: string;
    price: number;
    description: string;
    email: string;
    stock: number;
    isInternal: boolean;
}


export interface ProductResponse {
    data: {
        products: Product[],
        total: number
    }
  }
  