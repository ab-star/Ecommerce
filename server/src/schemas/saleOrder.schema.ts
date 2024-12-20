import { z } from 'zod';

// Zod schema for validating SalesOrder
export const SalesOrderReqSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(10, 'Mobile number must have at least 10 digits').max(10, 'Mobile number cannot exceed 10 digits'),
  products: z.array(
    z.object({
      productId: z.number().int().min(1, 'Product ID is required'),
      quantity: z.number().int().min(1, 'Quantity should be a positive integer')
    })
  ).min(1, 'At least one product is required')  // Ensure products array is not empty
});


// Automatically infer the type from the Zod schema
export type SalesOrderData = z.infer<typeof SalesOrderReqSchema>;
