import { CreationAttributes } from 'sequelize';
import { Integration } from '../models/integration.model';
import { injectable } from 'inversify';

@injectable()
export class IntegrationRepository {
  async createIntegration(email: string, apiUrl: string, apiToken?: string) {
    try {
        const data = { email, apiUrl, apiToken } as CreationAttributes<Integration>
        const newIntegration = await Integration.create(data);
        return newIntegration;
    } catch (error) {
      throw new Error('Error creating integration: ');
    }
  }

  async findIntegrationByEmail(email: string) {
    try {
      const integration = await Integration.findOne({ where: { email } });
      return integration;
    } catch (error) {
      throw new Error('Error finding integration: ');
    }
  }

  async updateIntegration(email: string, apiUrl: string, apiToken?: string) {
    try {
      const integration = await Integration.findOne({ where: { email } });
      if (integration) {
        integration.apiUrl = apiUrl;
        if (apiToken) {
          integration.apiToken = apiToken;
        }
        await integration.save();
        return integration;
      } else {
        throw new Error('Integration not found');
      }
    } catch (error) {
      throw new Error('Error updating integration: ');
    }
  }

  async deleteIntegration(email: string) {
    const integration = await this.findIntegrationByEmail(email);
    if (!integration) throw new Error('Integration not found');
    await integration.destroy();
  }
}
