import { inject } from 'inversify';
import { controller, httpPost, httpGet, httpPut, httpDelete, request, requestBody, response } from 'inversify-express-utils';
import { MasterProductService } from '../services/masterProduct.service';
import { ApiResponse } from '../dtos/response.dto';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { TYPES } from '../types';
import { ApiError } from '../dtos/error.dto';
import { MasterProductData, MasterProductSchema } from '../schemas/masterProduct.schema';

@controller('/api/master-products')
export class MasterProductController {
  constructor(
    @inject(TYPES.MasterProductService) private masterProductService: MasterProductService
  ) {}

  @httpPost('/', validateRequest(MasterProductSchema))
  public async createMasterProduct(@requestBody() masterProductData: MasterProductData, @response() res: any) {
    try {
      const result = await this.masterProductService.createMasterProduct(masterProductData);
      res.status(201).json(new ApiResponse(true, 'Master product created successfully', result));
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json(new ApiError('Error creating master product', [{ message: error.message }]));
      } else {
        res.status(500).json(new ApiError('Unknown error occurred', [{ message: 'An unknown error occurred' }]));
      }
    }
  }

  @httpGet('/')
  public async getMasterProducts(@request() req: any, @response() res: any) {
    const filters = req.query;
    const { page = 1, pageSize = 10 } = req.query;
    try {
      const result = await this.masterProductService.getMasterProducts(filters, Number(page), Number(pageSize));
      res.status(200).json(new ApiResponse(true, 'Master products retrieved successfully', result));
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json(new ApiError('Error retrieving master products', [{ message: error.message }]));
      } else {
        res.status(500).json(new ApiError('Unknown error occurred', [{ message: 'An unknown error occurred' }]));
      }
    }
  }

  @httpPut('/:id')
  public async updateMasterProduct(@request() req: any, @response() res: any) {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const result = await this.masterProductService.updateMasterProduct(id, updateData);
      res.status(200).json(new ApiResponse(true, 'Master product updated successfully', result));
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json(new ApiError('Error updating master product', [{ message: error.message }]));
      } else {
        res.status(500).json(new ApiError('Unknown error occurred', [{ message: 'An unknown error occurred' }]));
      }
    }
  }

  @httpDelete('/:id')
  public async deleteMasterProduct(@request() req: any, @response() res: any) {
    const { id } = req.params;
    try {
      await this.masterProductService.deleteMasterProduct(id);
      res.status(200).json(new ApiResponse(true, 'Master product deleted successfully'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json(new ApiError('Error deleting master product', [{ message: error.message }]));
      } else {
        res.status(500).json(new ApiError('Unknown error occurred', [{ message: 'An unknown error occurred' }]));
      }
    }
  }
}
