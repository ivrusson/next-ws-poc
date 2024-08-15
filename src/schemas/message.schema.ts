import { z } from 'zod';

export const messageSchema = z.object({
  type: z.string(),
  payload: z.any(),
});
