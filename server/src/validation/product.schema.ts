import { z } from 'zod';

const baseProduct = {
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  description: z.string().optional(),
  destinationId: z.string().uuid().optional(),
  thumbnailUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
};

const hotelFields = {
  starRating: z.number().int().min(1).max(5).optional(),
  address: z.string().min(5),
  checkInTime: z.string().default("14:00:00"),
  checkOutTime: z.string().default("12:00:00"),
  facilities: z.array(z.string()).optional(),
};

const packageFields = {
  durationDays: z.number().int().positive(),
  durationNights: z.number().int().positive(),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  includeItems: z.array(z.string()).optional(),
  excludeItems: z.array(z.string()).optional(),
  minPax: z.number().int().positive().default(1),
};

const rentalFields = {
  vehicleType: z.string().min(2).max(100),
  capacity: z.number().int().positive(),
  withDriver: z.boolean().default(false),
  transmission: z.string().max(20).optional(),
  pricePerDay: z.number().positive(),
  totalUnits: z.number().int().positive().default(1),
};

export const createProductSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("hotel"), ...baseProduct, ...hotelFields }),
  z.object({ type: z.literal("package"), ...baseProduct, ...packageFields }),
  z.object({ type: z.literal("rental"), ...baseProduct, ...rentalFields }),
]);

export const updateProductSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  destinationId: z.string().uuid().optional(),
  images: z.array(z.string().url()).optional(),
  // Hotel-specific
  starRating: z.number().int().min(1).max(5).optional(),
  address: z.string().min(5).optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  // Package-specific
  durationDays: z.number().int().positive().optional(),
  durationNights: z.number().int().positive().optional(),
  itinerary: z.array(z.object({ day: z.number(), title: z.string(), description: z.string() })).optional(),
  includeItems: z.array(z.string()).optional(),
  excludeItems: z.array(z.string()).optional(),
  minPax: z.number().int().positive().optional(),
  // Rental-specific
  vehicleType: z.string().min(2).max(100).optional(),
  capacity: z.number().int().positive().optional(),
  withDriver: z.boolean().optional(),
  transmission: z.string().max(20).optional(),
  pricePerDay: z.number().positive().optional(),
  totalUnits: z.number().int().positive().optional(),
});

export const queryProductSchema = z.object({
  type: z.enum(["hotel", "package", "rental"]).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  destinationId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof queryProductSchema>;
