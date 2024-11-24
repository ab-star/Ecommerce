import { inject } from 'inversify';
import {
  controller,
  httpPost,
  requestBody,
  response,
  request,
  httpGet,
  next,
} from 'inversify-express-utils';
import { SalesOrderService } from '../services/salesOrder.service';
import { ApiResponse } from '../dtos/response.dto';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { TYPES } from '../types';
import { SalesOrderReqSchema } from '../schemas/saleOrder.schema';
import { NextFunction } from 'express';

@controller('/api/sales-orders')
export class SalesOrderController {
  constructor(
    @inject(TYPES.SalesOrderService)
    private salesOrderService: SalesOrderService
  ) {}

  @httpPost('/', validateRequest({ body: SalesOrderReqSchema }))
  public async createSalesOrder(
    @requestBody() salesOrderData: any,
    @response() res: any,
    @next() next: NextFunction
  ) {
    try {
      const result =
        await this.salesOrderService.createSalesOrder(salesOrderData);
      res
        .status(201)
        .json(
          new ApiResponse(true, 'Sales order created successfully', result)
        );
    } catch (error: unknown) {
      next(error);
    }
  }

  @httpGet('/')
  public async getSalesOrders(
    @request() req: any,
    @response() res: any,
    @next() next: NextFunction
  ) {
    const filters = req.query;
    try {
      const result = await this.salesOrderService.getSalesOrders(filters);
      res
        .status(200)
        .json(
          new ApiResponse(true, 'Sales orders retrieved successfully', result)
        );
    } catch (error: unknown) {
      next(error);
    }
  }
}
