import { Table, Column, Model, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SalesOrder } from './salesOrder.model';
import { MasterProduct } from './masterProduct.model';

@Table
export class OrderProduct extends Model<OrderProduct> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => SalesOrder)
  @Column
  salesOrderId!: number;

  @ForeignKey(() => MasterProduct)
  @Column
  productId!: number;

  @Column
  quantity!: number;

  @Column
  price!: number;

   // Reverse associations
   @BelongsTo(() => SalesOrder)
   salesOrder!: SalesOrder;
 
   @BelongsTo(() => MasterProduct)
   masterProduct!: MasterProduct;
}
