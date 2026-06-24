/**
 * Relation all table database
 * 
 * */
import { relations } from "drizzle-orm";
import { refreshTokens, users } from "./users.js";
import { bookings, bookingStatusLogs } from "./bookings.js";
import { productImages, products } from "./products.js";
import { destinations } from "./destinations.js";
import { hotelRoomInventory, hotelRooms, hotels } from "./hotels.js";
import { packages, packageSchedules } from "./packages.js";
import { rentals } from "./rentals.js";
import { payments } from "./payments.js";



// Users relation

export const userRelations = relations(users, ({ one, many }) => ({
    createdByAdmin: one(users, {
        fields: [users.createdBy],
        references: [users.id],
        relationName: "user_creator"
    }),
    createdUsers: many(users, { relationName: "user_creator" }),
    refreshTokens: many(refreshTokens),
    bookings: many(bookings),
    createdProducts: many(products)
}));

export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id]
    }),
}));

// DESTINATION
export const destinationRelations = relations(destinations, ({ many }) => ({
    products: many(products),
}));

// PRODUCT RELATION

export const productRelations = relations(products, ({ one, many }) => ({
    destination: one(destinations, {
        fields: [products.destinationId],
        references: [destinations.id]
    }),

    createdByUser: one(users, { fields: [products.createdBy], references: [users.id] }),

    images: many(productImages),
    hotel: one(hotels, {
        fields: [products.id],
        references: [hotels.productId]
    }),

    package: one(packages, {
        fields: [products.id],
        references: [packages.productId],
    }),

    rental: one(rentals, {
        fields: [products.id],
        references: [rentals.productId],
    }),

    bookings: many(bookings)
}));

// PRODUCT IMAGES

export const productImagesRelations = relations(productImages, ({ one }) => ({
    product: one(products, {
        fields: [productImages.id],
        references: [products.id],
    }),
}));

// HOTEL RELATIONS

export const hotelRelations = relations(hotels, ({ one, many }) => ({
    product: one(products, {
        fields: [hotels.productId],
        references: [products.id]
    }),
    rooms: many(hotelRooms),
}));

// HOTEL ROOM RELATIONS

export const hotelRoomRelations = relations(hotelRooms, ({ one, many }) => ({
    product: one(hotels, {
        fields: [hotelRooms.hotelId],
        references: [hotels.productId],
    }),
    inventory: many(hotelRoomInventory),
    bookings: many(bookings),
}));

export const hotelRoomInventoryRelations = relations(hotelRoomInventory, ({ one }) => ({
    room: one(hotelRooms, {
        fields: [hotelRoomInventory.roomId],
        references: [hotelRooms.id]
    }),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
    product: one(products, { fields: [packages.productId], references: [products.id] }),
    schedules: many(packageSchedules),
}));

export const packageSchedulesRelations = relations(packageSchedules, ({ one, many }) => ({
    package: one(packages, { fields: [packageSchedules.packageId], references: [packages.productId] }),
    bookings: many(bookings),
}));


export const rentalsRelations = relations(rentals, ({ one }) => ({
    product: one(products, { fields: [rentals.productId], references: [products.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
    customer: one(users, { fields: [bookings.customerId], references: [users.id] }),
    product: one(products, { fields: [bookings.productId], references: [products.id] }),
    room: one(hotelRooms, { fields: [bookings.roomId], references: [hotelRooms.id] }),
    packageSchedule: one(packageSchedules, {
        fields: [bookings.packageScheduleId],
        references: [packageSchedules.id],
    }),
    confirmedByAdmin: one(users, { fields: [bookings.confirmedBy], references: [users.id] }),
    payment: one(payments, { fields: [bookings.id], references: [payments.bookingId] }),
    statusLogs: many(bookingStatusLogs),
}));

export const bookingStatusLogsRelations = relations(bookingStatusLogs, ({ one }) => ({
    booking: one(bookings, { fields: [bookingStatusLogs.bookingId], references: [bookings.id] }),
    changedByUser: one(users, { fields: [bookingStatusLogs.changedBy], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    booking: one(bookings, { fields: [payments.bookingId], references: [bookings.id] }),
}));