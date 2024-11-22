// src/models/integration.model.ts

import { AutoIncrement, Column, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

@Table
export class Integration extends Model<Integration> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Unique
  @Column
  apiUrl!: string;

  @Unique
  @Column
  apiToken?: string;  // Optional token for API authorization
}
