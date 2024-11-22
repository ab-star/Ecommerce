import { SalesOrderRepository } from '../repositories/salesOrder.repository';
// import { ProductRepository } from '../repositories/product.repository';
import axios from 'axios';
import { MasterProduct } from '../models/masterProduct.model';
import { SalesOrderData } from '../schemas/saleOrder.schema';
import { TYPES } from '../types';
import { inject } from 'inversify';

export class SalesOrderService {
  constructor(
    @inject(TYPES.SalesOrderRepository) private salesOrderRepository: SalesOrderRepository
  ) {}

  // Create a sales order
  public async createSalesOrder(salesOrderData: SalesOrderData): Promise<any> {
    const salesOrder = await this.salesOrderRepository.createSalesOrder(salesOrderData);
    return salesOrder;
  }

   // Validate stock before creating a sales order
  //  private async validateStock(products: { productId: number, quantity: number }[]): Promise<void> {
  //   for (const product of products) {
  //     const productData = await MasterProduct.findOne({ where: { id: product.productId } });
      
  //     if (!productData) {
  //       throw new Error(`Product with ID ${product.productId} not found`);
  //     }

  //     if (productData.stock < product.quantity) {
  //       throw new Error(`Insufficient stock for product: ${productData.name}. Available stock: ${productData.stockQuantity}`);
  //     }
  //   }
  // }

  // public async createSalesOrder(salesOrderData: any): Promise<any> {
  //   // Validate stock availability before creating the order
  //   await this.validateStock(salesOrderData.products);

  //   // Proceed with sales order creation if stock is sufficient
  //   const salesOrder = await this.salesOrderRepository.createSalesOrder(salesOrderData);

  //   // Deduct stock quantity after creating the order
  //   for (const product of salesOrderData.products) {
  //     const productData = await MasterProduct.findOne({ where: { id: product.productId } });

  //     if (productData) {
  //       await productData.update({
  //         stock: productData.stock - product.quantity,
  //       });
  //     }
  //   }

  //   // Optionally, you can call third-party API here
  //   // Push order details to third-party API
  //   // await axios.post(thirdPartyApiConfig.url, thirdPartyData, { headers: thirdPartyApiConfig.headers });

  //   return salesOrder;
  // }

  // Get sales orders with dynamic filtering
  public async getSalesOrders(filters: any) {
    return this.salesOrderRepository.getSalesOrders(filters);
  }

  public async deleteOrder(id: string , updateData: any) {
    return this.salesOrderRepository.updateSalesOrder(id , updateData);
  }

  public async updateOrder(id: string) {
    return this.salesOrderRepository.deleteSalesOrder(id);
  }
}
