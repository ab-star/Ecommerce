import { SalesOrder } from '../models/salesOrder.model';
import { OrderProduct } from '../models/salesOrderProduct.model';
import { MasterProduct } from '../models/masterProduct.model';
import { Op, CreationAttributes, Model } from 'sequelize';
import {sequelize} from "../config/db.config"
import { SalesOrderData } from '../schemas/saleOrder.schema';

export class SalesOrderRepository {
  // Create a new sales order with products
  public async createSalesOrder({ name, email, mobileNumber, products }: SalesOrderData): Promise<SalesOrder> {
    let salesOrder;
    try {
      // Start a transaction
      salesOrder = await sequelize.transaction(async (transaction) => {
        // Create the sales order
        const salesOrderData = { name, email, mobileNumber } as CreationAttributes<SalesOrder>;
        const salesOrder = await SalesOrder.create(salesOrderData, { transaction });

        for (const product of products) {
          const { productId, quantity } = product;

          // Validate product stock
          const masterProduct = await MasterProduct.findByPk(productId, { transaction });
          if (!masterProduct) {
            throw new Error(`Product with ID ${productId} not found`);
          }

          if (masterProduct.stock < quantity) {
            throw new Error(`Insufficient stock for product: ${masterProduct.name}`);
          }

          // Deduct stock
          masterProduct.stock -= quantity;
          await masterProduct.save({ transaction });

          // Create sales order product
          const saleData = {
            salesOrderId: salesOrder.id,
            productId,
            quantity,
            price: quantity * masterProduct.price,
          } as CreationAttributes<OrderProduct>;

          // Add product to the sales order
          await OrderProduct.create(saleData, { transaction });
        }

        return salesOrder;
      });

      return salesOrder;
    } catch (error) {
      console.error("Transaction error:", error);
      throw error; // This will trigger a rollback of the transaction
    }
  }

  // Get sales orders with dynamic filters
  public async getSalesOrders(filters: any): Promise<SalesOrder[]> {
    const { name, email, mobileNumber, orderDate } = filters;

    return SalesOrder.findAll({
      where: {
        ...(name && { name: { [Op.like]: `%${name}%` } }),
        ...(email && { email: { [Op.like]: `%${email}%` } }),
        ...(mobileNumber && { mobileNumber }),
        ...(orderDate && { orderDate: { [Op.eq]: new Date(orderDate) } }),
      },
      include: [{ model: OrderProduct, include: [MasterProduct] }],
    });
  }

  // Update a sales order
  public async updateSalesOrder(id: string, updateData: any): Promise<SalesOrder> {
    const salesOrder = await SalesOrder.findByPk(id);
    if (!salesOrder) {
      throw new Error('Sales order not found');
    }

    return salesOrder.update(updateData);
  }

  // Delete a sales order and update stock
  public async deleteSalesOrder(id: string): Promise<void> {
    return sequelize.transaction(async (transaction) => {
      const salesOrder = await SalesOrder.findByPk(id, { transaction });
      if (!salesOrder) {
        throw new Error('Sales order not found');
      }

      const salesOrderProducts = await OrderProduct.findAll({
        where: { salesOrderId: id },
        transaction,
      });

      for (const salesOrderProduct of salesOrderProducts) {
        const masterProduct = await MasterProduct.findByPk(salesOrderProduct.productId, { transaction });
        if (masterProduct) {
          // Restore stock
          masterProduct.stock += salesOrderProduct.quantity;
          await masterProduct.save({ transaction });
        }
      }

      // Delete associated products and the order
      await OrderProduct.destroy({ where: { salesOrderId: id }, transaction });
      await salesOrder.destroy({ transaction });
    });
  }
}
