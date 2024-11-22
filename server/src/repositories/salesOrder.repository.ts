import { SalesOrder } from '../models/salesOrder.model';
import { OrderProduct } from '../models/salesOrderProduct.model';
import { MasterProduct } from '../models/masterProduct.model';
import { Op, CreationAttributes, Order } from 'sequelize';
import { sequelize } from '../config/db.config';
import { SalesOrderData } from '../schemas/saleOrder.schema';

export class SalesOrderRepository {
  public async createSalesOrder({ name, email, mobileNumber, products }: SalesOrderData): Promise<SalesOrder> {
    return sequelize.transaction(async (transaction) => {

      const salesPayload = { name, email, mobileNumber } as CreationAttributes<SalesOrder>
      // Create the sales order
      const salesOrder = await SalesOrder.create(salesPayload, { transaction });

      for (const product of products) {
        const masterProduct = await MasterProduct.findByPk(product.productId, { transaction });

        if (!masterProduct) throw new Error(`Product with ID ${product.productId} not found`);
        if (masterProduct.stock < product.quantity) throw new Error(`Insufficient stock for product: ${masterProduct.name}`);

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
    });
  }

  public async getSalesOrders(filters: any): Promise<SalesOrder[]> {
    const { name, email, mobileNumber } = filters;

    // Query sales orders with dynamic filters
    return SalesOrder.findAll({
      where: {
        ...(name && { name: { [Op.like]: `%${name}%` } }), // Case-insensitive partial matching
        ...(email && { email: { [Op.like]: `%${email}%` } }),
        ...(mobileNumber && { mobileNumber }),
      },
      include: [
        {
          model: OrderProduct,
          include: [
            {
              model: MasterProduct,
              attributes: ['name', 'price'], // Fetch only required fields
            },
          ],
        },
      ],
    });
  }
}
