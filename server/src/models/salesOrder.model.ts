import { Table, Column, Model, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { OrderProduct } from './salesOrderProduct.model';

@Table({tableName: "TestOrder"})
export class SalesOrder extends Model<SalesOrder> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  email!: string;

  @Column
  mobileNumber!: string;

  @Column
  status!: string;

  @Column
  orderDate!: Date;

  @HasMany(() => OrderProduct)
  products!: OrderProduct[];
}
