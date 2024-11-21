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
  stock!: number; // Available stock
  
  @Column
  isInternal!: boolean; // created internally
}
