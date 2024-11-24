import { SalesOrder } from '../models/salesOrder.model';
import { OrderProduct } from '../models/salesOrderProduct.model';
import { MasterProduct } from '../models/masterProduct.model';
import { Op, CreationAttributes } from 'sequelize';
import { sequelize } from '../config/db.config';
import { SalesOrderData } from '../schemas/saleOrder.schema';
import {
  OutOfStockError,
  RepositoryError,
  ValidationError,
} from '../utils/errorCategory';
import {
  GENERIC_ERROR_MESSAGE,
  REPOSITORY_ERRORS,
} from '../constants/error.constants';

export class SalesOrderRepository {
  public async createSalesOrder({
    name,
    email,
    mobileNumber,
    products,
  }: SalesOrderData): Promise<any> {
    return sequelize.transaction(async (transaction) => {
      try {
        // Create the sales order
        const salesPayload = {
          name,
          email,
          mobileNumber,
          orderDate: new Date(),
        } as CreationAttributes<SalesOrder>;

        const salesOrder = await SalesOrder.create(salesPayload, {
          transaction,
        });

        const lineItems: any[] = []; // Initialize an array to build line items

        for (const product of products) {
          const masterProduct = await MasterProduct.findByPk(
            product.productId,
            { transaction }
          );

          if (!masterProduct) {
            throw new ValidationError(
              `Product with ID ${product.productId} not found`,
              [`Product with ID ${product.productId} not found`]
            );
          }

          if (masterProduct.stock < product.quantity) {
            throw new OutOfStockError(
              `Insufficient stock for product: ${masterProduct.name}`
            );
          }

          // Deduct stock
          masterProduct.stock -= product.quantity;
          await masterProduct.save({ transaction });

          // Create the order product entry
          const orderProductPayload = {
            salesOrderId: salesOrder.id,
            productId: product.productId,
            quantity: product.quantity,
            price: product.quantity * masterProduct.price, // Total price for the product
          } as CreationAttributes<OrderProduct>;

          await OrderProduct.create(orderProductPayload, { transaction });

          // Build line item using existing data
          lineItems.push({
            productName: masterProduct.name,
            quantity: product.quantity,
            price: product.quantity * masterProduct.price,
            originalPrice: masterProduct.price,
          });
        }

        // Return the sales order with line items
        return {
          headers: {
            id: salesOrder.id,
            name: salesOrder.name,
            email: salesOrder.email,
            mobileNumber: salesOrder.mobileNumber,
            orderDate: salesOrder.orderDate,
          },
          lineItems,
        };
      } catch (error) {
        if (
          error instanceof OutOfStockError ||
          error instanceof ValidationError
        ) {
          throw error;
        }
        throw new RepositoryError(GENERIC_ERROR_MESSAGE, error);
      }
    });
  }

  public async getSalesOrders(filters: any) {
    try {
      const { name, email, mobileNumber, startDate, endDate, isPublished } =
        filters;

      return SalesOrder.findAll({
        where: {
          ...(name && { name: { [Op.like]: `%${name}%` } }), // Case-insensitive partial matching
          ...(email && { email: { [Op.like]: `%${email}%` } }),
          ...(mobileNumber && { mobileNumber }),
          ...(isPublished && { isPublished }),
          // Add date range filter
          ...(startDate &&
            endDate && {
              orderDate: {
                [Op.between]: [new Date(startDate), new Date(endDate)],
              },
            }),
          ...(startDate &&
            !endDate && {
              orderDate: { [Op.gte]: new Date(startDate) },
            }),
          ...(!startDate &&
            endDate && {
              orderDate: { [Op.lte]: new Date(endDate) },
            }),
        },
        include: [
          {
            model: OrderProduct,
            attributes: ['quantity', 'price'],
            include: [
              {
                model: MasterProduct,
                attributes: ['name', 'price', 'stock'], // Fetch only required fields
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new RepositoryError(GENERIC_ERROR_MESSAGE, error);
    }
  }

  public async updatePublishStatus(id: string) {
    try {
      // Define the condition to find the record
      const whereCond = { id };

      // Specify the single field to update
      const updateData = { isPublished: true } as Partial<
        CreationAttributes<SalesOrder>
      >;

      // Perform the update operation
      const [updatedRowCount, updatedMasterProduct] = await SalesOrder.update(
        updateData,
        {
          where: whereCond,
          returning: true, // Retrieve the updated record
        }
      );

      // Check if no rows were updated
      if (updatedRowCount === 0) {
        throw new ValidationError(REPOSITORY_ERRORS.RECORD_NOT_FOUND(id), []);
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
