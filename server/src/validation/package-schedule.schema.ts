import { z } from 'zod';

export const createPackageScheduleSchema = z.object({
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  pricePerPax: z.number().positive(),
  quota: z.number().int().positive(),
  status: z.enum(["open", "closed", "cancelled"]).optional(),
}).strict().refine(
  (data: { departureDate: string; returnDate: string }) => new Date(data.returnDate) >= new Date(data.departureDate),
  { message: "returnDate must be after or equal to departureDate", path: ["returnDate"] }
);

export const updatePackageScheduleSchema = z.object({
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  pricePerPax: z.number().positive().optional(),
  quota: z.number().int().positive().optional(),
  bookedCount: z.number().int().min(0).optional(),
  status: z.enum(["open", "closed", "cancelled"]).optional(),
}).strict();

export type CreatePackageScheduleInput = z.infer<typeof createPackageScheduleSchema>;
export type UpdatePackageScheduleInput = z.infer<typeof updatePackageScheduleSchema>;
