import { inject } from 'inversify';
import { controller, httpPost, requestBody, response, request, httpGet } from 'inversify-express-utils';
import { SalesOrderService } from '../services/salesOrder.service';
import { ApiResponse } from '../dtos/response.dto';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { TYPES } from '../types';
import { ApiError } from '../dtos/error.dto';
import { SalesOrderReqSchema } from '../schemas/saleOrder.schema';


@controller('/api/sales-orders')
export class SalesOrderController {
  constructor(
    @inject(TYPES.SalesOrderService) private salesOrderService: SalesOrderService
  ) {}

  @httpPost('/', validateRequest(SalesOrderReqSchema))
  public async createSalesOrder(@requestBody() salesOrderData: any, @response() res: any) {
    try {
      const result = await this.salesOrderService.createSalesOrder(salesOrderData);
      res.status(201).json(new ApiResponse(true, 'Sales order created successfully'));
    } catch (error: unknown) { // Typing the error as unknown
      if (error instanceof Error) { // Narrowing down to Error type
        res.status(500).json(new ApiError('Error creating sales order', [{ message: error.message }]));
      } else {
        res.status(500).json(new ApiError('Unknown error occurred', [{ message: 'An unknown error occurred' }]));
      }
    }
  }

  @httpGet('/')
  public async getSalesOrders(@request() req: any, @response() res: any) {
    const filters = req.query;
    try {
      const result = await this.salesOrderService.getSalesOrders(filters);
      res.status(200).json(new ApiResponse(true, 'Sales orders retrieved successfully', result));
    } catch (error: unknown) { // Typing the error as unknown
      if (error instanceof Error) { // Narrowing down to Error type
        res.status(500).json(new ApiError('Error retrieving sales orders', [{ message: error.message }]));
      } else {
        res.status(500).json(new ApiError('Unknown error occurred', [{ message: 'An unknown error occurred' }]));
      }
    }
  }
}
