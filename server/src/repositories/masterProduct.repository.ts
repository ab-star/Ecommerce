import { MasterProduct } from '../models/masterProduct.model';
import { Sequelize, Op, Optional, CreationAttributes } from 'sequelize';
import { MasterProductData } from '../schemas/masterProduct.schema';

export class MasterProductRepository {
  // Create a new master product
  public async createMasterProduct(masterProductData: MasterProductData): Promise<MasterProduct> {
    // Use CreationAttributes to properly type the object for create()
    const product = await MasterProduct.create(masterProductData as CreationAttributes<MasterProduct>);

    return product;
  }

  // Get master products with dynamic filters and pagination
  public async getMasterProducts(filters: any, page: number = 1, pageSize: number = 10): Promise<{ products: MasterProduct[], total: number }> {
    const { name , priceRange , isInternal } = filters;

    const whereClause = {
      ...(name && { name: { [Op.like]: `%${name}%` } }),
      ...(isInternal && {isInternal}),
      ...(priceRange && {
        price: {
          [Op.between]: [priceRange.min, priceRange.max], // Filtering by price range
        },
      }),
    };

    // Get paginated results
    const products = await MasterProduct.findAll({
      where: whereClause,
      limit: pageSize,
      offset: page * pageSize,  // Calculate the offset for pagination
    });

    // Get the total count of matching products (for pagination metadata)
    const total = await MasterProduct.count({
      where: whereClause,
    });

    return { products, total };
  }

  // Update a master product
  public async updateMasterProduct(id: string, updateData: MasterProductData): Promise<MasterProduct> {
    const masterProduct = await MasterProduct.findByPk(id);
    if (!masterProduct) {
      throw new Error('Master product not found');
    }
    return masterProduct.update(updateData);
  }

  // Delete a master product
  public async deleteMasterProduct(id: string): Promise<boolean> {
    const masterProduct = await MasterProduct.findByPk(id);
    if (!masterProduct) {
      throw new Error('Master product not found');
    }
    
    await masterProduct.destroy();
    return true;  // Return true if successfully deleted
  }
}
