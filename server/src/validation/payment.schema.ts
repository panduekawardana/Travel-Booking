import { z } from 'zod';

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  grossAmount: z.number().positive(),
}).strict();

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["pending", "settlement", "capture", "deny", "cancel", "expire", "refund", "failure"]),
  midtransTransactionId: z.string().optional(),
  paymentMethod: z.string().optional(),
  rawResponse: z.any().optional(),
  paidAt: z.string().datetime().optional(),
}).strict();

export const queryPaymentSchema = z.object({
  status: z.enum(["pending", "settlement", "capture", "deny", "cancel", "expire", "refund", "failure"]).optional(),
  bookingId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const midtransCallbackSchema = z.object({
  transaction_status: z.string(),
  order_id: z.string(),
  transaction_id: z.string().optional(),
  payment_type: z.string().optional(),
  gross_amount: z.string().optional(),
  transaction_time: z.string().optional(),
}).passthrough();

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type QueryPaymentInput = z.infer<typeof queryPaymentSchema>;
export type MidtransCallbackInput = z.infer<typeof midtransCallbackSchema>;
