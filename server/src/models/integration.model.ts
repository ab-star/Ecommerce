// src/models/integration.model.ts

import { Column, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

@Table({ tableName: 'Integrations' })
export class Integration extends Model<Integration> {
  @PrimaryKey
  @Column
  id!: number;

  @Unique
  @Column
  email!: string;

  @Column
  apiUrl!: string;

  @Column
  apiToken?: string;  // Optional token for API authorization
}
