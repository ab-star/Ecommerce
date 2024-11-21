import { inject } from 'inversify';
import { MasterProductRepository } from '../repositories/masterProduct.repository';
import { MasterProductData } from '../schemas/masterProduct.schema';
import { TYPES } from '../types';

export class MasterProductService {
  constructor(
    @inject(TYPES.MasterProductRepository) private masterProductRepository: MasterProductRepository
  ) {}

  // Create a new master product
  public async createMasterProduct(masterProductData: MasterProductData): Promise<any> {
    const masterProduct = await this.masterProductRepository.createMasterProduct(masterProductData);
    return masterProduct;
  }

  // Get master products with dynamic filtering and pagination
  public async getMasterProducts(filters: any, page: number, pageSize: number , isInternal=false): Promise<any> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const result = await this.masterProductRepository.getMasterProducts(filters, offset, limit , isInternal);
    return result;
  }

  // Update an existing master product
  public async updateMasterProduct(id: string, updateData: any): Promise<any> {
    const masterProduct = await this.masterProductRepository.updateMasterProduct(id, updateData);
    return masterProduct;
  }

  // Delete a master product
  public async deleteMasterProduct(id: string): Promise<void> {
    await this.masterProductRepository.deleteMasterProduct(id);
  }
}
