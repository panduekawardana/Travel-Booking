import { z } from 'zod';

export const createInventorySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  availableRooms: z.number().int().min(0),
  priceOverride: z.number().positive().optional(),
}).strict();

export const bulkUpsertInventorySchema = z.object({
  inventories: z.array(createInventorySchema).min(1).max(365),
}).strict();

export const updateInventorySchema = z.object({
  availableRooms: z.number().int().min(0).optional(),
  priceOverride: z.number().positive().optional(),
}).strict();

export const queryInventorySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type BulkUpsertInventoryInput = z.infer<typeof bulkUpsertInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type QueryInventoryInput = z.infer<typeof queryInventorySchema>;
