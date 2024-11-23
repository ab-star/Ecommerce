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
  public async createMasterProduct(masterProductData: MasterProductType , isInternal = false) {
    try {
      const existingProduct = await this.masterProductRepository.findProductByNameAndEmail(
        masterProductData.name,
        masterProductData.email
      );

      if (existingProduct) {
        throw new ValidationError(PRODUCTSERVICE_ERROS.DUPLICATE_ERROR , []);
      }

      // Proceed with creating the product if no duplicates
      const masterProduct = await this.masterProductRepository.createMasterProduct(masterProductData , isInternal);
      return masterProduct
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)
    }
  }

  // Get master products with dynamic filtering and pagination
  public async getMasterProducts(page: number, pageSize: number, isInternal = false) {
    try {
      const offset = (page - 1) * pageSize;
      const limit = pageSize;
  
      const result = await this.masterProductRepository.getMasterProducts(offset, limit, isInternal);
      return result;
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)
    }
  }

  // Update an existing master product
  public async updateMasterProduct(id: string, updateData: any , isInternal=false) {
    try {
      const masterProduct = await this.masterProductRepository.updateMasterProduct(id, updateData , isInternal);
      return masterProduct;
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)
    }
  }

  // Delete a master product
  public async deleteMasterProduct(id: string , isInternal=false) {
    try {
      return await this.masterProductRepository.deleteMasterProduct(id , isInternal);
    } catch (error) {
      throw new ServiceError(GENERIC_ERROR_MESSAGE, error)

    }
  }
}
