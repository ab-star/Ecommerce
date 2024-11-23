import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
  DataType,
} from 'sequelize-typescript';

@Table
export class MasterProduct extends Model<MasterProduct> {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id!: number;

  @Column({ allowNull: false })
  name!: string;

  @Column({ allowNull: false, type: DataType.FLOAT })
  price!: number;

  @Column({ allowNull: false })
  description!: string;

  @Column({ allowNull: false })
  email!: string;

  @Column({ allowNull: false, type: DataType.INTEGER })
  stock!: number; // Available stock
  
  @Column({ allowNull: false, defaultValue: false })
  isInternal!: boolean; // Created internally, defaults to false if not provided
}
