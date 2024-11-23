import { controller, httpPost, httpGet, httpPut, httpDelete, request, requestBody, response, requestParam, next as nextHandler, next } from 'inversify-express-utils';
import { IntegrationService } from '../services/integration.service';
import { createIntegrationSchema } from '../schemas/integration.schema'; // Adjusted import
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

  // Create a new integration or replace an existing one
  @httpPost('/', validateRequest({ body: createIntegrationSchema }))
  async createIntegration(@requestBody() body: any, @response() res: any, @next() next: any) {
    try {
      const { apiUrl, apiToken } = body;
      const integration = await this.integrationService.createOrReplaceIntegration(apiUrl, apiToken);
      res.status(201).json({ message: 'Integration created/replaced successfully', integration });
    } catch (error) {
      return next(error); 
    }
  }

  // Fetch integration details
  @httpGet('/') 
  async getIntegration(@response() res: any, @next() next: any) {
    try {
      const integration = await this.integrationService.getIntegration();
      res.status(200).json({ integration });
    } catch (error) {
      return next(error); // Passing service-level errors to error handler
    }
  }


  // Delete the integration
  @httpDelete('/')
  async deleteIntegration(@response() res: any, @next() next: any) {
    try {
      const message = await this.integrationService.deleteIntegration();
      res.status(200).json({ message });
    } catch (error) {
      return next(error); // Passing service-level errors to error handler
    }
  }
}
