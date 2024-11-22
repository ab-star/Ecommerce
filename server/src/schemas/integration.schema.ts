import { z } from 'zod';

export const createIntegrationSchema = z.object({
  apiUrl: z.string().url(),
  apiToken: z.string().optional(),
});
