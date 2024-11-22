import axios from 'axios';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class ApiIntegrationService {
  constructor(
    @inject(TYPES.IntegrationRepository) private integrationRepository: any // Assuming you have a repository to fetch integration data
  ) {}

  // Get integration API details
  public async getIntegration() {
    return this.integrationRepository.getIntegration();
  }

  // Send sales order to the external API
  public async sendSalesOrderToApi(salesOrder: any, apiUrl: string, apiToken: string) {
    const headers = {
      Authorization: `Bearer ${apiToken}`,
    };

    // Prepare header and line items format
    const header = {
      name: salesOrder.name,
      email: salesOrder.email,
      mobileNumber: salesOrder.mobileNumber,
    };

    const lineItems = salesOrder.products.map((product: any) => ({
      productName: product.product.name,
      quantity: product.quantity,
      price: product.price,
    }));

    const data = { header, lineItems };

    try {
      const response = await axios.post(apiUrl, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error('Error sending data to external API');
    }
  }
}
