import { inject } from 'inversify';
import { SalesOrderRepository } from '../repositories/salesOrder.repository';
import axios from 'axios';
import { TYPES } from '../types';
import { SalesOrderData } from '../schemas/saleOrder.schema';
import { IntegrationRepository } from '../repositories/integration.repository';

export class SalesOrderService {
  constructor(
    @inject(TYPES.SalesOrderRepository) private salesOrderRepository: SalesOrderRepository,
    @inject(TYPES.IntegrationRepository) private integrationRepository: IntegrationRepository
  ) {}

  public async createSalesOrder(salesOrderData: SalesOrderData): Promise<any> {
    // Validate and create sales order
    const salesOrder = await this.salesOrderRepository.createSalesOrder(salesOrderData);

    // Check if integration API exists
    // const integration = await this.integrationRepository.findIntegration();
    // if (integration) {
    //   // Prepare data to send to the external API
    //   const requestData = this.prepareIntegrationPayload(salesOrder);
    //   await axios.post(integration.apiUrl, requestData, {
    //     headers: { Authorization: `Bearer ${integration.apiToken}` },
    //   });
    // }

    return salesOrder;
  }

  public async getSalesOrders(filters: any): Promise<any> {
    return this.salesOrderRepository.getSalesOrders(filters);
  }

  private prepareIntegrationPayload(salesOrder: any) {
    const lineItems = salesOrder.products.map((product: any) => ({
      productName: product.name,
      quantity: product.quantity,
      price: product.price,
    }));

    return {
      name: salesOrder.name,
      email: salesOrder.email,
      mobileNumber: salesOrder.mobileNumber,
      lineItems,
    };
  }
}
