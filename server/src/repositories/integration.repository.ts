import { CreationAttributes } from 'sequelize';
import { Integration } from '../models/integration.model';
import { NotFoundError, RepositoryError } from '../utils/errorCategory';
import { GENERIC_ERROR_MESSAGE } from '../constants/error.constants';

export class IntegrationRepository {
  
  // Find an existing integration (assuming only one integration can exist)
  async findIntegration() {
    try {
      const integration = await Integration.findOne();
      return integration;
    } catch (error: any) {
      throw new RepositoryError(GENERIC_ERROR_MESSAGE, error);
    }
  }

  // Create a new integration
  async createIntegration(apiUrl: string, apiToken?: string) {
    try {
      const data = {
        apiUrl,
        apiToken,
      } as CreationAttributes<Integration>;

      const newIntegration = await Integration.create(data);
      return newIntegration;
    } catch (error: any) {
      throw new RepositoryError(GENERIC_ERROR_MESSAGE, error);
    }
  }

  // Delete an existing integration if present
  async deleteExistingIntegration() {
    try {
      const deletedRowCount = await Integration.destroy({ where: {} });
      return deletedRowCount ? true : false
    } catch (error: any) {
      throw new RepositoryError('Error in deleting existing integration', error);
    }
  }

}
