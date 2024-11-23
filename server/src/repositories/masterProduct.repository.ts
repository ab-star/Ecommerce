import { CreationAttributes, UniqueConstraintError } from 'sequelize';
import { MasterProduct } from '../models/masterProduct.model';
import { NotFoundError, RepositoryError, ValidationError } from '../utils/errorCategory';
import { GENERIC_ERROR_MESSAGE, REPOSITORY_ERRORS } from '../constants/error.constants';
import { MasterProductType } from '../schemas/masterProduct.schema';

export class MasterProductRepository {
  // Create a new master product
  public async createMasterProduct(masterProductData: MasterProductType , isInternal=false) {
    try {
      
      const data = masterProductData as CreationAttributes<MasterProduct>;

      if(isInternal){
        data.isInternal = true
      }
      // Attempt to create the new master product
      const newProduct = await MasterProduct.create(data);
      return newProduct;
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintError) {
        // Handle the unique constraint violation error (e.g., duplicate product name or other fields)
        const duplicateField = error.errors[0].path as string; // The field that caused the violation
        const message = REPOSITORY_ERRORS.DUPLICATE_RECORD(duplicateField);
        throw new ValidationError(message, [message], error);
      }

      // Handle other errors
      throw new RepositoryError(GENERIC_ERROR_MESSAGE, error);
    }
  }

  // Get master products with dynamic filters and pagination
  public async getMasterProducts(page: number = 1, pageSize: number = 10 , isInternal=false) {
    try {
      // Fetch paginated results

      const whereFilter: {[key: string]: boolean} = {}
      if(isInternal){
        whereFilter.isInternal = true
      }

      const products = await MasterProduct.findAll({
        where: whereFilter,
        limit: pageSize,
        offset: page // Calculate the offset for pagination
      });
  
      // Get the total count of products (for pagination metadata)
      const total = await MasterProduct.count({where: whereFilter});
  
      return { products, total };
    } catch (error: any) {
      throw new RepositoryError('Failed to fetch master products', error);
    }
  }

  // Update a master product
  public async updateMasterProduct(id: string, updateData: MasterProductType , isInternal=false) {
    try {
      // Try to update the record

      const whereCond = {
        id,
        isInternal
      }

      const [updatedRowCount, updatedMasterProduct] = await MasterProduct.update(
        updateData,
        { where: whereCond, returning: true }
      );
  
      if (updatedRowCount === 0) {
        throw new ValidationError(REPOSITORY_ERRORS.RECORD_NOT_FOUND(id) , [REPOSITORY_ERRORS.RECORD_NOT_FOUND(id)]);
      }
  
      // Return the updated product if update was successful
      return updatedMasterProduct;
  
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error; // Propagate NotFoundError
      }
      // Handle any other errors, such as repository or validation errors
      throw new RepositoryError(GENERIC_ERROR_MESSAGE, error);
    }
  }  

  // Delete a master product
  public async deleteMasterProduct(id: string , isInternal=false) {
    try {
      // Try to delete the record

      const whereCond = {
        id ,
        isInternal
      }

      const deletedRowCount = await MasterProduct.destroy({
        where: whereCond,
      });
  
      if (deletedRowCount === 0) {
        // The record was not found at all
        throw new ValidationError(REPOSITORY_ERRORS.RECORD_NOT_FOUND(id) , [REPOSITORY_ERRORS.RECORD_NOT_FOUND(id)]);
      }
  
      // If a row was deleted, return true to indicate success
      return {message: "Deleted Succussfully"};
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error; // Propagate NotFoundError
      }
      // Handle other repository or validation errors
      throw new RepositoryError(GENERIC_ERROR_MESSAGE, error);
    }
  }

  public async findProductByNameAndEmail(name: string, email: string) {
    try {
      return await MasterProduct.findOne({
        where: {
          name,
          email
        }
      });
    } catch (error) {
      throw new RepositoryError(GENERIC_ERROR_MESSAGE, error);
    }
  }
  
}
