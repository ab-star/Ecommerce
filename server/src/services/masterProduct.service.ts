import { inject } from 'inversify';
import { MasterProductRepository } from '../repositories/masterProduct.repository';
import { MasterProductType } from '../schemas/masterProduct.schema';
import { TYPES } from '../types';
import { ServiceError, ValidationError } from '../utils/errorCategory';
import { GENERIC_ERROR_MESSAGE } from '../constants/error.constants';


const PRODUCTSERVICE_ERROS = {
  DUPLICATE_ERROR: "This product already exists"
}

export class MasterProductService {
  constructor(
    @inject(TYPES.MasterProductRepository) private masterProductRepository: MasterProductRepository
  ) { }

  // Create a new master product
  public async createMasterProduct(masterProductData: MasterProductType) {
    try {
      const existingProduct = await this.masterProductRepository.findProductByNameAndEmail(
        masterProductData.name,
        masterProductData.email
      );

      if (existingProduct) {
        throw new ValidationError(PRODUCTSERVICE_ERROS.DUPLICATE_ERROR , []);
      }

      // Proceed with creating the product if no duplicates
      const masterProduct = await this.masterProductRepository.createMasterProduct(masterProductData);
      return masterProduct
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)
    }
  }

  // Get master products with dynamic filtering and pagination
  public async getMasterProducts(page: number, pageSize: number, isInternal = false) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const result = await this.masterProductRepository.getMasterProducts(offset, limit, isInternal);
    return result;
  }

  // Update an existing master product
  public async updateMasterProduct(id: string, updateData: any) {
    try {
      const masterProduct = await this.masterProductRepository.updateMasterProduct(id, updateData);
      return masterProduct;
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)
    }
  }

  // Delete a master product
  public async deleteMasterProduct(id: string) {
    try {
      await this.masterProductRepository.deleteMasterProduct(id);

    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)

    }
  }
}
