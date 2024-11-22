import { z } from 'zod';

// Zod schema for creating a master product
export const MasterProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  email: z.string().email(),
  price: z.number().min(0, 'Price should be a positive number'),
  description: z.string().min(1 , "Description required"),
  stock: z.number().int().min(0, 'Stock should be a non-negative integer'), // Stock should be a non-negative integer
});

export const MasterProductQuerySchema = z.object({
  page: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Page must be a positive number',
    }),
  limit: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Limit must be a positive number',
    }),
});


export const MasterProductPathSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required'), // Optional validation for non-empty ID string
});

// Automatically infer the type from the Zod schema
export type MasterProductType = z.infer<typeof MasterProductSchema>;
export type MasterProductIntType = MasterProductType & {isInternal: boolean};

