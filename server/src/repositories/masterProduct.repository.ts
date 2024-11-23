import { CreationAttributes, Op, UniqueConstraintError } from 'sequelize';
import { MasterProduct } from '../models/masterProduct.model';
import { NotFoundError, RepositoryError, ValidationError } from '../utils/errorCategory';
import { GENERIC_ERROR_MESSAGE, REPOSITORY_ERRORS } from '../constants/error.constants';
import { MasterProductType } from '../schemas/masterProduct.schema';

export class MasterProductRepository {
  // Create a new master product
  public async createMasterProduct(masterProductData: MasterProductType, isInternal = false) {
    try {

      const data = masterProductData as CreationAttributes<MasterProduct>;

      if (isInternal) {
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
  public async getMasterProducts(
    offset: number,
    limit: number,
    filters: { name?: string; email?: string; priceRange?: { min?: number; max?: number } },
    orderBy?: 'price' | 'createdDate',  // New parameter for sorting
    orderDirection: 'ASC' | 'DESC' = 'ASC',  // Default to ascending if not provided
    isInternal = false
  ) {
    try {
      const whereFilter: { [key: string]: any } = {};
  
      // Apply filters dynamically
      if (isInternal) {
        whereFilter.isInternal = isInternal;
      }
  
      if (filters.name) {
        whereFilter.name = { [Op.iLike]: `%${filters.name}%` }; // Case-insensitive search
      }
      if (filters.email) {
        whereFilter.email = { [Op.iLike]: `%${filters.email}%` }; // Case-insensitive search
      }
      if (filters.priceRange) {
        const priceConditions: { [Op.gte]?: number; [Op.lte]?: number } = {};
        if (filters.priceRange.min !== undefined) {
          priceConditions[Op.gte] = filters.priceRange.min;
        }
        if (filters.priceRange.max !== undefined) {
          priceConditions[Op.lte] = filters.priceRange.max;
        }
        whereFilter.price = priceConditions;
      }
  
      // Build the sorting order
      let order: [string, string][] = [];
      if (orderBy === 'price') {
        order = [['price', orderDirection]];
      } else if (orderBy === 'createdDate') {
        order = [['createdAt', orderDirection]]; // Assuming created date is stored in 'createdAt'
      }
  
      // Fetch paginated and sorted results
      const products = await MasterProduct.findAll({
        where: whereFilter,
        limit,
        offset,
        order,  // Apply the sorting order
      });
  
      // Get the total count of products (for pagination metadata)
      const total = await MasterProduct.count({ where: whereFilter });
  
      return { products, total };
    } catch (error: any) {
      throw new RepositoryError('Failed to fetch master products', error);
    }
  }  


  // Update a master product
  public async updateMasterProduct(id: string, updateData: MasterProductType, isInternal = false) {
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
        throw new ValidationError(REPOSITORY_ERRORS.RECORD_NOT_FOUND(id), [REPOSITORY_ERRORS.RECORD_NOT_FOUND(id)]);
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
  public async deleteMasterProduct(id: string, isInternal = false) {
    try {
      // Try to delete the record

      const whereCond = {
        id,
        isInternal
      }

      const deletedRowCount = await MasterProduct.destroy({
        where: whereCond,
      });

      if (deletedRowCount === 0) {
        // The record was not found at all
        throw new ValidationError(REPOSITORY_ERRORS.RECORD_NOT_FOUND(id), [REPOSITORY_ERRORS.RECORD_NOT_FOUND(id)]);
      }

      // If a row was deleted, return true to indicate success
      return { message: "Deleted Succussfully" };
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
