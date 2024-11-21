import { z } from 'zod';

// Zod schema for creating a master product
export const MasterProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price should be a positive number'),
  description: z.string().min(1 , "Description required"),
  stock: z.number().int().min(0, 'Stock should be a non-negative integer'), // Stock should be a non-negative integer
});

// Automatically infer the type from the Zod schema
export type MasterProductData = z.infer<typeof MasterProductSchema>;
