import { inject } from 'inversify';
import { controller, httpPost, httpGet, httpPut, httpDelete, request, requestBody, response, queryParam, requestParam, next } from 'inversify-express-utils';
import { MasterProductService } from '../services/masterProduct.service';
import { ApiResponse } from '../dtos/response.dto';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { TYPES } from '../types';
import { ApiError } from '../dtos/error.dto';
import { MasterProductPathSchema, MasterProductQuerySchema, MasterProductSchema, MasterProductType } from '../schemas/masterProduct.schema';
import { NextFunction, Response, Request } from 'express';

@controller('/api/products')
export class MasterProductController {
  constructor(
    @inject(TYPES.MasterProductService) private masterProductService: MasterProductService
  ) { }

  @httpPost('/', validateRequest({ body: MasterProductSchema }))
  public async createMasterProduct(@requestBody() masterProductData: MasterProductType,
    @response() res: Response, @next() next: NextFunction) {
    try {
      const result = await this.masterProductService.createMasterProduct(masterProductData);
      res.status(201).json(new ApiResponse(true, 'Master product created successfully', result));
    } catch (error: unknown) {
      next(error)
    }
  }

  @httpGet('/', validateRequest({ query: MasterProductQuerySchema }))
  public async getMasterProducts(
    @request() req: Request,
    @queryParam('page') page: number,
    @queryParam('limit') limit: number,
    @response() res: Response,
    @next() next: NextFunction) {
    try {
      const result = await this.masterProductService.getMasterProducts(page, limit);
      res.status(200).json(new ApiResponse(true, 'Master products retrieved successfully', result));
    } catch (error: unknown) {
      next(error)
    }
  }

  @httpPut('/:id', validateRequest({ params: MasterProductPathSchema , body: MasterProductSchema }))
  public async updateMasterProduct(
    @requestBody() payload: MasterProductType,
    @requestParam("id") id: string,
    @response() res: Response,
    @next() next: NextFunction) {

    try {
      const result = await this.masterProductService.updateMasterProduct(id, payload);
      res.status(200).json(new ApiResponse(true, 'Master product updated successfully', result));
    } catch (error: unknown) {
      next(error)
    }
  }

  @httpDelete('/:id', validateRequest({ params: MasterProductPathSchema }))
  public async deleteMasterProduct(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction,
    @requestParam("id") id: string) {
    try {
      await this.masterProductService.deleteMasterProduct(id);
      res.status(200).json(new ApiResponse(true, 'Master product deleted successfully'));
    } catch (error: unknown) {
      next(error)
    }
  }
}
