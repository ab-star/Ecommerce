import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IntegrationRepository } from '../repositories/integration.repository';
import { ServiceError } from '../utils/errorCategory';
import { GENERIC_ERROR_MESSAGE } from '../constants/error.constants';

@injectable()
export class IntegrationService {
  private integrationRepository: IntegrationRepository;

  constructor(
    @inject(TYPES.IntegrationRepository)
    integrationRepository: IntegrationRepository
  ) {
    this.integrationRepository = integrationRepository;
  }

  // Create or replace an existing integration
  async createOrReplaceIntegration(apiUrl: string, apiToken?: string) {
    try {
      // Attempt to delete the existing integration if present
      await this.integrationRepository.deleteExistingIntegration();
      // Create the new integration
      return await this.integrationRepository.createIntegration(
        apiUrl,
        apiToken
      );
    } catch (error: any) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error);
    }
  }

  // Get the current integration
  async getIntegration() {
    try {
      return await this.integrationRepository.findIntegration();
    } catch (error: any) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error);
    }
  }

  // Delete the integration
  async deleteIntegration() {
    try {
      return await this.integrationRepository.deleteExistingIntegration();
    } catch (error: any) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error);
    }
  }
}
