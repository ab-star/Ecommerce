import { inject } from 'inversify';
import { controller, httpPost, httpGet, httpPut, httpDelete, request, requestBody, response } from 'inversify-express-utils';
import { MasterProductService } from '../services/masterProduct.service';
import { TYPES } from '../types';
import { ApiResponse } from '../dtos/response.dto';
import { determineAccessType } from '../middlewares/determineAccess.middleware';
import { ApiError } from '../dtos/error.dto';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { MasterProductData, MasterProductDataInt, MasterProductSchema } from '../schemas/masterProduct.schema';
import { Request, Response } from 'express';

@controller('/internal-api/master-products')
export class InternalMasterProductController {
  constructor(
    @inject(TYPES.MasterProductService) private masterProductService: MasterProductService
  ) {}

  @httpPost('/' , determineAccessType(true) , validateRequest(MasterProductSchema))
  public async createMasterProduct(@requestBody() masterProductData: MasterProductDataInt, @response() res: any) {
    try {
      masterProductData.isInternal = true
      const result = await this.masterProductService.createMasterProduct(masterProductData);
      res.status(201).json(new ApiResponse(true, 'Master product created (internal)', result));
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: 'Internal API error', error });
    }
  }

  @httpGet('/' , determineAccessType(true))
  public async getMasterProducts(@requestBody() req: MasterProductDataInt & Request , @response() res: Response) {
    try {

      const {page , limit} = req.query
      const filters: Record<string, any> = { ...req.query }; // Copy query parameters to filters
      filters.isInternal = req.isInternal

      const result = await this.masterProductService.getMasterProducts(filters, Number(page), Number(limit) ); // Internal API may fetch all
      res.status(200).json(new ApiResponse(true, 'Master products retrieved (internal)', result));
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: 'Internal API error', error });
    }
  }

  @httpPut('/:id' , determineAccessType(true) , validateRequest(MasterProductSchema))
  public async updateMasterProduct(@request() req: MasterProductData & Request, @response() res: Response) {
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

  @httpDelete('/:id' , determineAccessType(true))
  public async deleteMasterProduct(@request() req: Request, @response() res: Response) {
    const { id } = req.params;
    try {

      if(!id){
        throw new Error("Id Required")
      }

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

