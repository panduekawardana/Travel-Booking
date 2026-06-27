import { z } from 'zod';

export const createBookingSchema = z.discriminatedUnion("productType", [
  z.object({
    productType: z.literal("hotel"),
    productId: z.string().uuid(),
    roomId: z.string().uuid(),
    packageScheduleId: z.null().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    guestCount: z.number().int().positive().default(1),
    unitCount: z.number().int().positive().default(1),
    contactName: z.string().min(2).max(150),
    contactPhone: z.string().min(5).max(20),
    notes: z.string().optional(),
  }),
  z.object({
    productType: z.literal("package"),
    productId: z.string().uuid(),
    packageScheduleId: z.string().uuid(),
    roomId: z.null().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    guestCount: z.number().int().positive().default(1),
    unitCount: z.number().int().positive().default(1),
    contactName: z.string().min(2).max(150),
    contactPhone: z.string().min(5).max(20),
    notes: z.string().optional(),
  }),
  z.object({
    productType: z.literal("rental"),
    productId: z.string().uuid(),
    roomId: z.null().optional(),
    packageScheduleId: z.null().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    guestCount: z.number().int().positive().default(1),
    unitCount: z.number().int().positive().default(1),
    contactName: z.string().min(2).max(150),
    contactPhone: z.string().min(5).max(20),
    notes: z.string().optional(),
  }),
]);

export const updateBookingSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guestCount: z.number().int().positive().optional(),
  unitCount: z.number().int().positive().optional(),
  contactName: z.string().min(2).max(150).optional(),
  contactPhone: z.string().min(5).max(20).optional(),
  notes: z.string().optional(),
}).strict();

export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending_payment", "paid", "confirmed", "cancelled", "expired", "completed"]),
  note: z.string().optional(),
}).strict();

export const queryBookingSchema = z.object({
  status: z.enum(["pending_payment", "paid", "confirmed", "cancelled", "expired", "completed"]).optional(),
  productType: z.enum(["hotel", "package", "rental"]).optional(),
  customerId: z.string().uuid().optional(),
  search: z.string().optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type QueryBookingInput = z.infer<typeof queryBookingSchema>;
