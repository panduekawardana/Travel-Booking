import { z } from 'zod';

export const createDestinationSchema = z.object({
  name: z.string().min(2).max(150),
  slug: z.string().min(2).max(170),
  province: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  description: z.string().optional(),
}).strict();

export const updateDestinationSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  slug: z.string().min(2).max(170).optional(),
  province: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  description: z.string().optional(),
}).strict();

export const queryDestinationSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
export type QueryDestinationInput = z.infer<typeof queryDestinationSchema>;
