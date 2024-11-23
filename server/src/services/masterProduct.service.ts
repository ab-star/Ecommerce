import { inject } from 'inversify';
import { MasterProductRepository } from '../repositories/masterProduct.repository';
import { MasterProductType } from '../schemas/masterProduct.schema';
import { TYPES } from '../types';
import { ServiceError, ValidationError } from '../utils/errorCategory';
import { GENERIC_ERROR_MESSAGE } from '../constants/error.constants';


const PRODUCTSERVICE_ERROS = {
  DUPLICATE_ERROR: "This product already exists for this user"
}

export class MasterProductService {
  constructor(
    @inject(TYPES.MasterProductRepository) private masterProductRepository: MasterProductRepository
  ) { }

  // Create a new master product
  public async createMasterProduct(masterProductData: MasterProductType, isInternal = false) {
    try {
      const existingProduct = await this.masterProductRepository.findProductByNameAndEmail(
        masterProductData.name,
        masterProductData.email
      );

      if (existingProduct) {
        throw new ValidationError(PRODUCTSERVICE_ERROS.DUPLICATE_ERROR, [PRODUCTSERVICE_ERROS.DUPLICATE_ERROR]);
      }

      // Proceed with creating the product if no duplicates
      const masterProduct = await this.masterProductRepository.createMasterProduct(masterProductData, isInternal);
      return masterProduct
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)
    }
  }


  public async getMasterProducts(
    page: number,
    pageSize: number,
    filters: {
      name?: string;
      email?: string;
      priceRange?: { min?: number; max?: number };
    },
    isInternal = false
  ) {
    try {
      // Calculate offset and limit for pagination
      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      // Pass filters, offset, and limit to the repository
      const result = await this.masterProductRepository.getMasterProducts(offset, limit, filters, isInternal);
      return result;
    } catch (error) {
      throw new ServiceError('Failed to retrieve master products', error);
    }
  }



  // Update an existing master product
  public async updateMasterProduct(id: string, updateData: any, isInternal = false) {
    try {
      const masterProduct = await this.masterProductRepository.updateMasterProduct(id, updateData, isInternal);
      return masterProduct[0];
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)
    }
  }

  // Delete a master product
  public async deleteMasterProduct(id: string, isInternal = false) {
    try {
      return await this.masterProductRepository.deleteMasterProduct(id, isInternal);
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)

    }
  }
}
