// src/validators/integration.validator.ts

import { z } from 'zod';

export const createIntegrationSchema = z.object({
  email: z.string().email(),
  apiUrl: z.string().url(),
  apiToken: z.string().optional(),
});
