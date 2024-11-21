import { inject } from 'inversify';
import { controller, httpPost, httpGet, httpPut, httpDelete, request, requestBody, response } from 'inversify-express-utils';
import { MasterProductService } from '../services/masterProduct.service';
import { TYPES } from '../types';
import { ApiResponse } from '../dtos/response.dto';

@controller('/internal-api/master-products')
export class InternalMasterProductController {
  constructor(
    @inject(TYPES.MasterProductService) private masterProductService: MasterProductService
  ) {}

  @httpPost('/')
  public async createMasterProduct(@requestBody() masterProductData: any, @response() res: any) {
    try {
      const result = await this.masterProductService.createMasterProduct(masterProductData);
      res.status(201).json(new ApiResponse(true, 'Master product created (internal)', result));
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: 'Internal API error', error });
    }
  }

  @httpGet('/')
  public async getMasterProducts(@response() res: any) {
    try {
      const result = await this.masterProductService.getMasterProducts({}, 1, 100 , true); // Internal API may fetch all
      res.status(200).json(new ApiResponse(true, 'Master products retrieved (internal)', result));
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: 'Internal API error', error });
    }
  }
}
