import { controller, httpPost, httpGet, httpPut, httpDelete, request, requestBody, response, requestParam } from 'inversify-express-utils';
import { IntegrationService } from '../services/integration.service';
import { createIntegrationSchema } from '../schemas/integration.schema';
import { z } from 'zod';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { validateRequest } from '../middlewares/validateRequest.middleware';

@controller('/integrations')
export class IntegrationController {
  private integrationService: IntegrationService;

  constructor(
    @inject(TYPES.IntegrationService) integrationService: IntegrationService
  ) {
    this.integrationService = integrationService;
  }

  // Create a new integration
  @httpPost('/', validateRequest(createIntegrationSchema))
  async createIntegration(@requestBody() body: any) {
    const parsedData = createIntegrationSchema.safeParse(body);
    if (!parsedData.success) {
      return { status: 400, message: 'Invalid input data', errors: parsedData.error.errors };
    }

    const { email, apiUrl, apiToken } = parsedData.data;

    try {
      const integration = await this.integrationService.createIntegration(email, apiUrl, apiToken);
      return { status: 201, message: 'Integration created successfully', integration };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  // Fetch integration by email
  @httpGet('/:email') 
  async getIntegration(@requestParam('email') email: string) {
    try {
      const integration = await this.integrationService.getIntegrationByEmail(email);
      if (!integration) {
        return { status: 404, message: 'Integration not found' };
      }
      return { status: 200, integration };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  // Update an existing integration
  @httpPut('/:email')
  async updateIntegration(@requestParam('email') email: string, @requestBody() body: any) {
    // const parsedData = updateIntegrationSchema.safeParse(body);
    const parsedData = {success: ""}
    if (!parsedData.success) {
      return { status: 400, message: 'Invalid input data', errors: parsedData.error.errors };
    }

    const { apiUrl, apiToken } = parsedData.data;

    try {
      const integration = await this.integrationService.updateIntegration(email, apiUrl, apiToken);
      if (!integration) {
        return { status: 404, message: 'Integration not found' };
      }
      return { status: 200, message: 'Integration updated successfully', integration };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  // Delete an integration
  @httpDelete('/:email')
  async deleteIntegration(@requestParam('email') email: string) {
    try {
      const message = await this.integrationService.deleteIntegration(email);
      return { status: 200, message };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  // Send sales order to third-party API
  @httpPost('/salesOrder')
  async sendSalesOrder(@requestBody() body: any) {
    const { email, salesData } = body;

    try {
      await this.integrationService.sendSalesOrderToAPI(email, salesData);
      return { status: 200, message: 'Sales order sent to external API successfully' };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }
}
