/**
 * INDEX SCHEMA
 * export all table types
 * total tables : 14
 * 
 * users.ts          → users, refreshTokens
 * destinations.ts   → destinations
 * products.ts       → products, productImages
 * hotels.ts         → hotels, hotelRooms, hotelRoomInventory
 * bookings.ts       → bookings, bookingStatusLogs
 * packages.ts       → packages, packageSchedules
 * rentals.ts        → rentals
 * payments.ts       → payments
 * 
 * */

export { users, refreshTokens } from './users.js';
export { destinations } from './destinations.js';
export { products, productImages } from './products.js';
export { hotels, hotelRooms, hotelRoomInventory } from './hotels.js';
export { bookings, bookingStatusLogs } from './bookings.js';
export { packages, packageSchedules } from './packages.js';
export { rentals } from './rentals.js';
export { payments } from './payments.js';

// Relations
export * from './relations.js'

// Enum
export * from './enum.js';
