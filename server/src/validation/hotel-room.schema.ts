import { z } from 'zod';

export const createHotelRoomSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().optional(),
  pricePerNight: z.number().positive(),
  totalRooms: z.number().int().positive().default(1),
  facilities: z.array(z.string()).optional(),
}).strict();

export const updateHotelRoomSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  description: z.string().optional(),
  pricePerNight: z.number().positive().optional(),
  totalRooms: z.number().int().positive().optional(),
  facilities: z.array(z.string()).optional(),
}).strict();

export type CreateHotelRoomInput = z.infer<typeof createHotelRoomSchema>;
export type UpdateHotelRoomInput = z.infer<typeof updateHotelRoomSchema>;
