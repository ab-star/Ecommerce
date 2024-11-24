import { inject } from 'inversify';
import { SalesOrderRepository } from '../repositories/salesOrder.repository';
import axios from 'axios';
import { TYPES } from '../types';
import { SalesOrderData } from '../schemas/saleOrder.schema';
import { IntegrationRepository } from '../repositories/integration.repository';
import { ServiceError } from '../utils/errorCategory';
import { GENERIC_ERROR_MESSAGE } from '../constants/error.constants';

export class SalesOrderService {
  constructor(
    @inject(TYPES.SalesOrderRepository)
    private salesOrderRepository: SalesOrderRepository,
    @inject(TYPES.IntegrationRepository)
    private integrationRepository: IntegrationRepository
  ) {}

  public async createSalesOrder(salesOrderData: SalesOrderData): Promise<any> {
    try {
      // Validate and create sales order
      const salesOrder: any =
        await this.salesOrderRepository.createSalesOrder(salesOrderData);

      // Check if integration API exists
      const integration = await this.integrationRepository.findIntegration();
      let isPublished = false;

      if (integration) {
        // Prepare data to send to the external API
        const requestData = this.prepareIntegrationPayload(salesOrder);

        let headerVal = {};

        if (integration.apiToken) {
          headerVal = { Authorization: `Bearer ${integration.apiToken}` };
        }

        try {
          await axios.post(integration.apiUrl, requestData, {
            headers: headerVal,
          });
          this.salesOrderRepository.updatePublishStatus(
            salesOrder?.headers?.id
          );
          isPublished = true;
        } catch (error) {
          isPublished = false;
        }
      }

      return isPublished
        ? salesOrder
        : { message: 'sale created but unable to publish', salesOrder };
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error);
    }
  }

  public async getSalesOrders(filters: any): Promise<any> {
    try {
      return this.salesOrderRepository.getSalesOrders(filters);
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error);
    }
  }

  private prepareIntegrationPayload(salesOrder: any) {
    const lineItems = salesOrder.lineItems.map((product: any) => ({
      productName: product.name,
      quantity: product.quantity,
      price: product.price,
    }));

    return {
      headers: salesOrder.headers,
      lineItems,
    };
  }
}
