import { Sequelize } from 'sequelize-typescript';
import { SalesOrder } from '../models/salesOrder.model';
import { OrderProduct } from '../models/salesOrderProduct.model';
import { MasterProduct } from '../models/masterProduct.model';
import { QueryTypes } from 'sequelize';

// Global variable to hold the Sequelize instance for the ecom database
let sequelize: Sequelize;

export const connectDb = async () => {
  try {
    // Step 1: Initialize Sequelize with the default 'postgres' database
    const postgresSequelize = new Sequelize({
      dialect: 'postgres',
      host: 'localhost',
      username: 'root',
      password: 'yourpassword', // Use your actual password
      database: 'postgres',     // Connect to 'postgres' to check/create 'ecom'
      logging: false,           // Disable logging for production
    });

    // Step 2: Check if the 'ecom' database exists
    const result = await postgresSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = 'ecom'`,
      { type: QueryTypes.SELECT }
    );

    // Step 3: Create 'ecom' database if it doesn't exist
    if (!result.length) {
      await postgresSequelize.query('CREATE DATABASE ecom');
      console.log('Database "ecom" created successfully');
    }

    // Step 4: Initialize Sequelize with the 'ecom' database
    sequelize = new Sequelize({
      dialect: 'postgres',
      host: 'localhost',
      username: 'root',
      password: 'yourpassword', // Use your actual password
      database: 'ecom',         // Use 'ecom' database now
      models: [SalesOrder, OrderProduct, MasterProduct],
      logging: false,            // Enable logging for development
    });

    // Step 6: Authenticate and sync models
    await sequelize.authenticate();
    console.log('Database connected successfully to "ecom"');

    await sequelize.sync();
    console.log('Models synced successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize };