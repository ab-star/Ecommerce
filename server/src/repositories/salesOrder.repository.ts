import { SalesOrder } from '../models/salesOrder.model';
import { OrderProduct } from '../models/salesOrderProduct.model';
import { MasterProduct } from '../models/masterProduct.model';
import { Op, CreationAttributes, ValidationError } from 'sequelize';
import { sequelize } from '../config/db.config';
import { SalesOrderData } from '../schemas/saleOrder.schema';
import { OutOfStockError, RepositoryError } from '../utils/errorCategory';
import { GENERIC_ERROR_MESSAGE, REPOSITORY_ERRORS } from '../constants/error.constants';

export class SalesOrderRepository {
  public async createSalesOrder({ name, email, mobileNumber , products }: SalesOrderData) {
      return sequelize.transaction(async (transaction) => {
  
        try {
          const salesPayload = { name, email, mobileNumber } as CreationAttributes<SalesOrder>
          // Create the sales order

          salesPayload.orderDate = new Date()
          const salesOrder = await SalesOrder.create(salesPayload, { transaction });
    
          for (const product of products) {
            const masterProduct = await MasterProduct.findByPk(product.productId, { transaction });
    
            if (!masterProduct) throw new ValidationError(`Product with ID ${product.productId} not found` , []);
              if (masterProduct.stock < product.quantity) throw new OutOfStockError(`Insufficient stock for product: ${masterProduct.name}`);
    
            // Deduct stock
            masterProduct.stock -= product.quantity;
            await masterProduct.save({ transaction });
    
            const orderProductPayload = {
              salesOrderId: salesOrder.id,
              productId: product.productId,
              quantity: product.quantity,
              price: product.quantity * masterProduct.price,
            } as CreationAttributes<OrderProduct>
    
            // Add the product to the order
            await OrderProduct.create(
              orderProductPayload,
              { transaction }
            );
          }
    
          return salesOrder;
        } catch (error) {
          if(error instanceof OutOfStockError || error instanceof ValidationError){
            throw error
          }
          throw new RepositoryError(GENERIC_ERROR_MESSAGE , error)
        }
      });
     
  }

  public async getSalesOrders(filters: any) {
    try {
      const { name, email, mobileNumber, startDate, endDate } = filters;
    
      return SalesOrder.findAll({
        where: {
          ...(name && { name: { [Op.like]: `%${name}%` } }), // Case-insensitive partial matching
          ...(email && { email: { [Op.like]: `%${email}%` } }),
          ...(mobileNumber && { mobileNumber }),
    
          // Add date range filter
          ...(startDate && endDate && {
            orderDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
          }),
          ...(startDate && !endDate && {
            orderDate: { [Op.gte]: new Date(startDate) },
          }),
          ...(!startDate && endDate && {
            orderDate: { [Op.lte]: new Date(endDate) },
          }),
        },
        include: [
          {
            model: OrderProduct,
            attributes: ["quantity", "price"],
            include: [
              {
                model: MasterProduct,
                attributes: ["name", "price", "stock"], // Fetch only required fields
              },
            ],
          },
        ],
      });
    } catch (error) {
        throw new RepositoryError(GENERIC_ERROR_MESSAGE , error)
    }
  }


  public async updatePublishStatus(id: string) {
    try {
      // Define the condition to find the record
      const whereCond = { id };
  
      // Specify the single field to update
      const updateData = { isPublished: true } as Partial<CreationAttributes<SalesOrder>>;
  
      // Perform the update operation
      const [updatedRowCount, updatedMasterProduct] = await SalesOrder.update(updateData, {
        where: whereCond,
        returning: true, // Retrieve the updated record
      });
  
      // Check if no rows were updated
      if (updatedRowCount === 0) {
        throw new ValidationError(REPOSITORY_ERRORS.RECORD_NOT_FOUND(id), [
        ]);
      }
  
      // Return the updated record
      return updatedMasterProduct[0]; // Return the first updated record
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error; // Propagate ValidationError
      }
      // Wrap and throw other errors
      throw new RepositoryError(GENERIC_ERROR_MESSAGE, error);
    }
  }
}
