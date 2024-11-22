// src/services/integration.service.ts

import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IntegrationRepository } from '../repositories/integration.repository';
import axios from 'axios';

@injectable()
export class IntegrationService {
  private integrationRepository: IntegrationRepository;

  constructor(
    @inject(TYPES.IntegrationRepository) integrationRepository: IntegrationRepository
  ) {
    this.integrationRepository = integrationRepository;
  }

  // Create a new integration
  async createIntegration(email: string, apiUrl: string, apiToken?: string) {
    const existingIntegration = await this.integrationRepository.findIntegrationByEmail(email);
    if (existingIntegration) {
      throw new Error('Integration already exists for this email');
    }

    const newIntegration = await this.integrationRepository.createIntegration(email, apiUrl, apiToken);
    return newIntegration;
  }

    // Fetch integration details by email
    async getIntegrationByEmail(email: string) {
        const integration = await this.integrationRepository.findIntegrationByEmail(email);
        if (!integration) {
          throw new Error(`No integration found for email: ${email}`);
        }
        return integration;
      }
    
      // Update an existing integration
      async updateIntegration(email: string, apiUrl: string, apiToken?: string) {
        const integration = await this.integrationRepository.updateIntegration(email, apiUrl, apiToken);
        if (!integration) {
          throw new Error(`Integration with email ${email} not found`);
        }
        return integration;
      }
    
      // Delete an integration
      async deleteIntegration(email: string) {
        const integration = await this.integrationRepository.findIntegrationByEmail(email);
        if (!integration) {
          throw new Error(`Integration with email ${email} not found`);
        }
    
        await this.integrationRepository.deleteIntegration(email);
        return { message: `Integration for email ${email} deleted successfully` };
      }    

  // Send sales order details to the third-party API
  async sendSalesOrderToAPI(email: string, salesData: any) {
    const integration = await this.integrationRepository.findIntegrationByEmail(email);
    if (!integration) {
      throw new Error('No integration found for this email');
    }

    // Send the sales data to the external API
    try {
      await axios.post(integration.apiUrl, salesData, {
        headers: {
          Authorization: `Bearer ${integration.apiToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw new Error('Error sending sales data to external API: ');
    }
  }
}
