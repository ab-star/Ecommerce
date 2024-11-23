import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { SalesOrderController } from '../controllers/salesOrder.controller';
import { SalesOrderService } from '../services/salesOrder.service';
import { SalesOrderRepository } from '../repositories/salesOrder.repository';
import { IntegrationRepository } from '../repositories/integration.repository';
import request from 'supertest';

// Mock the SalesOrderService and its dependencies
jest.mock('../services/salesOrder.service');
jest.mock('../repositories/salesOrder.repository');
jest.mock('../repositories/integration.repository');

describe('SalesOrderController', () => {
  let salesOrderServiceMock: jest.Mocked<SalesOrderService>;
  let salesOrderRepositoryMock: jest.Mocked<SalesOrderRepository>;
  let integrationRepositoryMock: jest.Mocked<IntegrationRepository>;

  let app: InversifyExpressServer;

  beforeAll(() => {
    // Create and bind mocks
    salesOrderRepositoryMock = new SalesOrderRepository() as jest.Mocked<SalesOrderRepository>;
    integrationRepositoryMock = new IntegrationRepository() as jest.Mocked<IntegrationRepository>;

    salesOrderServiceMock = new SalesOrderService(salesOrderRepositoryMock, integrationRepositoryMock) as jest.Mocked<SalesOrderService>;

    // Setting up Inversify container and app
    const container = new Container();
    container.bind(SalesOrderService).toConstantValue(salesOrderServiceMock);
    container.bind(SalesOrderController).to(SalesOrderController); // Bind the controller

    app = new InversifyExpressServer(container);
  });

  // Utility function for building and getting the express app
  const getApp = () => app.build();

  describe('POST /api/sales-orders', () => {
    it('should create a sales order successfully when request is valid', async () => {
      const validRequestData = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "mobileNumber": "1234567890",
        "products": [
          {
            "productId": 1,
            "quantity": 2
          }
        ]
      };

      const expectedResponse = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        mobileNumber: '1234567890',
        products: [{ productId: 1, quantity: 2 }],
      };

      // Mock the createSalesOrder method to return the expected response
      salesOrderServiceMock.createSalesOrder = jest.fn().mockResolvedValue(expectedResponse);

      const response = await request(getApp())
        .post('/api/sales-orders')
        .send(validRequestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sales order created successfully');
    });

    it('should return 400 if the request data is invalid', async () => {
      const invalidRequestData = {
        name: '', // Invalid name
        email: 'invalid-email',
        mobileNumber: '12345', // Invalid mobile number
        products: [], // No products
      };

      const response = await request(getApp())
        .post('/api/sales-orders')
        .send(invalidRequestData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/sales-orders', () => {
    it('should retrieve sales orders with no filters', async () => {
      const expectedResponse = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          mobileNumber: '1234567890',
        },
      ];

      // Mock the getSalesOrders method to return a list of sales orders
      salesOrderServiceMock.getSalesOrders = jest.fn().mockResolvedValue(expectedResponse);

      const response = await request(getApp())
        .get('/api/sales-orders')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sales orders retrieved successfully');
      expect(response.body.data).toEqual(expectedResponse);
    });

    it('should return an empty array if no sales orders match the filters', async () => {
      const filters = {};
      salesOrderServiceMock.getSalesOrders = jest.fn().mockResolvedValue([]);

      const response = await request(getApp())
        .get('/api/sales-orders')
        .query(filters)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Sales orders retrieved successfully');
      expect(response.body.data).toEqual([]);
    });
  });
});
