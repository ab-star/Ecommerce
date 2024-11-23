import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import { MasterProductService } from '../services/masterProduct.service';
import request from 'supertest';
import { TYPES } from '../types';
import { MasterProductType } from '../schemas/masterProduct.schema';
import { MasterProductRepository } from '../repositories/masterProduct.repository';

// Mock the MasterProductService
jest.mock('../services/masterProduct.service');

describe('MasterProductController', () => {
  let masterProductServiceMock: jest.Mocked<MasterProductService>;
  let app: InversifyExpressServer;

  beforeAll(() => {
    const masterProductRepositoryMock = new MasterProductRepository() as jest.Mocked<MasterProductRepository>;
    // Create and bind mocks
    masterProductServiceMock = new MasterProductService(masterProductRepositoryMock) as jest.Mocked<MasterProductService>;

    // Setting up Inversify container and app
    const container = new Container();
    container.bind(MasterProductService).toConstantValue(masterProductServiceMock);

    app = new InversifyExpressServer(container);
  });

  // Utility function for building and getting the express app
  const getApp = () => app.build();

  describe('POST /api/products', () => {
    it('should create a master product successfully when request is valid', async () => {
      const validRequestData = {
        name: "Product A",
        email: "product@example.com",
        price: 100,
      };

      const expectedResponse = {
        id: 1,
        name: "Product A",
        email: "product@example.com",
        price: 100,
      };

      // Mock the createMasterProduct method to return the expected response
      masterProductServiceMock.createMasterProduct = jest.fn().mockResolvedValue(expectedResponse);

      const response = await request(getApp())
        .post('/api/products')
        .send(validRequestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Master product created successfully');
      expect(response.body.data).toEqual(expectedResponse);
    });

    it('should return 400 if the request data is invalid', async () => {
      const invalidRequestData = {
        name: '',
        email: 'invalid-email',
        price: 'invalid-price',
      };

      const response = await request(getApp())
        .post('/api/products')
        .send(invalidRequestData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products', () => {
    it('should retrieve master products with filters', async () => {
      const expectedResponse = [
        { id: 1, name: 'Product A', email: 'product@example.com', price: 100 },
      ];

      // Mock the getMasterProducts method to return a list of products
      masterProductServiceMock.getMasterProducts = jest.fn().mockResolvedValue(expectedResponse);

      const response = await request(getApp())
        .get('/api/products')
        .query({ name: 'Product A', minPrice: '50', maxPrice: '150' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Master products retrieved successfully');
      expect(response.body.data).toEqual(expectedResponse);
    });

    it('should return an empty array if no products match the filters', async () => {
        const expectedResponse: MasterProductType[] = [];
      
        // Mock the getMasterProducts method to return an empty array
        masterProductServiceMock.getMasterProducts = jest.fn().mockResolvedValue(expectedResponse);
      
        const response = await request(getApp())
          .get('/api/products')
          .query({ name: 'Non-existent product' })
          .expect(200);
      
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Master products retrieved successfully');
        expect(response.body.data).toEqual(expectedResponse);
      });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a master product successfully', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 120,
      };

      const expectedResponse = {
        id: 1,
        name: 'Updated Product',
        price: 120,
      };

      // Mock the updateMasterProduct method to return the updated product
      masterProductServiceMock.updateMasterProduct = jest.fn().mockResolvedValue(expectedResponse);

      const response = await request(getApp())
        .put('/api/products/1')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Master product updated successfully');
      expect(response.body.data).toEqual(expectedResponse);
    });

    it('should return 400 if the request data is invalid', async () => {
      const invalidUpdateData = {
        name: '',
        price: 'invalid-price',
      };

      const response = await request(getApp())
        .put('/api/products/1')
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a master product successfully', async () => {
      // Mock the deleteMasterProduct method to resolve successfully
      masterProductServiceMock.deleteMasterProduct = jest.fn().mockResolvedValue(undefined);

      const response = await request(getApp())
        .delete('/api/products/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Master product deleted successfully');
    });

    it('should return 404 if the product does not exist', async () => {
      // Mock the deleteMasterProduct method to throw an error (product not found)
      masterProductServiceMock.deleteMasterProduct = jest.fn().mockRejectedValue(new Error('Product not found'));

      const response = await request(getApp())
        .delete('/api/products/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });
});
