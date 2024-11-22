import { Table, Column, Model, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table
export class MasterProduct extends Model<MasterProduct> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  price!: number;

  @Column
  description!: string;

  @Column
  email!: string;

  @Column
  stock!: number; // Available stock
  
  @Column({ defaultValue: false })
  isInternal!: boolean; // created internally, defaults to false if not provided
}
