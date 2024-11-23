import { inject } from 'inversify';
import { controller, httpPost, httpGet, httpPut, httpDelete, request, requestBody, response, queryParam, requestParam, next } from 'inversify-express-utils';
import { MasterProductService } from '../services/masterProduct.service';
import { TYPES } from '../types';
import { ApiResponse } from '../dtos/response.dto';
import { determineInternalAccessType } from '../middlewares/determineAccess.middleware';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { MasterProductSchema, MasterProductPathSchema, MasterProductQuerySchema, MasterProductType } from '../schemas/masterProduct.schema';
import { NextFunction, Request, Response } from 'express';

@controller('/api/internal/products')
export class InternalMasterProductController {
  constructor(
    @inject(TYPES.MasterProductService) private masterProductService: MasterProductService
  ) { }

  @httpPost('/', determineInternalAccessType(true), validateRequest({ body: MasterProductSchema }))
  public async createMasterProduct(@requestBody() masterProductData: MasterProductType,
    @response() res: Response, @next() next: NextFunction) {
    try {
      const result = await this.masterProductService.createMasterProduct(masterProductData, true);
      res.status(201).json(new ApiResponse(true, 'Master product created successfully', result));
    } catch (error: unknown) {
      next(error)
    }
  }

  // @httpGet('/', determineInternalAccessType(true), validateRequest({ query: MasterProductQuerySchema }))
  // public async getMasterProducts(
  //   @request() req: Request,
  //   @queryParam('page') page: number,
  //   @queryParam('limit') limit: number,
  //   @response() res: Response,
  //   @next() next: NextFunction) {
  //   try {
  //     const result = await this.masterProductService.getMasterProducts(page, limit , true);
  //     res.status(200).json(new ApiResponse(true, 'Master products retrieved successfully', result));
  //   } catch (error: unknown) {
  //     next(error)
  //   }
  // }

  @httpGet('/', determineInternalAccessType(true), validateRequest({ query: MasterProductQuerySchema }))
  public async getMasterProducts(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction,
    @queryParam('page') page: number,
    @queryParam('limit') limit: number,
    @queryParam('name') name?: string,
    @queryParam('email') email?: string,
    @queryParam('minPrice') minPrice?: string, // Allow as string for parsing
    @queryParam('maxPrice') maxPrice?: string
  ) {
    try {
      // Parse numeric query params for minPrice and maxPrice
      const parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
      const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

      // Build a dynamic filters object
      const filters: {
        name?: string;
        email?: string;
        priceRange?: { min?: number; max?: number };
      } = {};

      if (name) filters.name = name;
      if (email) filters.email = email;
      if (parsedMinPrice !== undefined || parsedMaxPrice !== undefined) {
        filters.priceRange = {};
        if (parsedMinPrice !== undefined) filters.priceRange.min = parsedMinPrice;
        if (parsedMaxPrice !== undefined) filters.priceRange.max = parsedMaxPrice;
      }

      // Pass filters to the service layer
      const result = await this.masterProductService.getMasterProducts(page, limit, filters, true);
      res.status(200).json(new ApiResponse(true, 'Master products retrieved successfully', result));
    } catch (error: unknown) {
      next(error);
    }
  }

  @httpPut('/:id', determineInternalAccessType(true), validateRequest({ params: MasterProductPathSchema, body: MasterProductSchema }))
  public async updateMasterProduct(
    @requestBody() payload: MasterProductType,
    @requestParam("id") id: string,
    @response() res: Response,
    @next() next: NextFunction) {

    try {
      const result = await this.masterProductService.updateMasterProduct(id, payload, true);
      res.status(200).json(new ApiResponse(true, 'Master product updated successfully', result));
    } catch (error: unknown) {
      next(error)
    }
  }

  @httpDelete('/:id', determineInternalAccessType(true), validateRequest({ params: MasterProductPathSchema }))
  public async deleteMasterProduct(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction,
    @requestParam("id") id: string) {
    try {
      await this.masterProductService.deleteMasterProduct(id, true);
      res.status(200).json(new ApiResponse(true, 'Master product deleted successfully'));
    } catch (error: unknown) {
      next(error)
    }
  }
}

