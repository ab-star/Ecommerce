import { Table, Column, Model, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { OrderProduct } from './salesOrderProduct.model';

@Table({tableName: "SalesOrder"})
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
  orderDate!: Date;

  @HasMany(() => OrderProduct)
  products!: OrderProduct[];

  @Column({ defaultValue: false })
  isPublished!: boolean; // Created internally, defaults to false if not provided
}
