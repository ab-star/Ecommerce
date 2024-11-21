import { z } from 'zod';

// Zod schema for creating a sales order
export const CreateSalesOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(10, 'Mobile number should be at least 10 digits'),
  status: z.enum(['pending', 'completed', 'shipped']).refine((val) => ['pending', 'completed', 'shipped'].includes(val), {
    message: 'Invalid order status',
  }),
  orderDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  products: z.array(z.number()).min(1, 'At least one product is required'), // Assuming product IDs are passed
});
