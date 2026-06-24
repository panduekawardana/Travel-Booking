import { pgEnum } from "drizzle-orm/pg-core";

// ALL ENUM
/**
 * ? Enum User Role
*/

// export const userRoleEnum = pgEnum("user_role", [
//     "admin", "costumer"
// ]);

/**
 * 
 * ? Enum Products Table & Product Status Enum
 * 
*/

export const productEnum = pgEnum("product_type", [
    "hotel", "package", "rental",
]);

export const productStatusEnum = pgEnum("product_status", [
    "draft", "published", "archived"
]);


/**
 * Schadule status enum 
 * */

export const scheduleStatusEnum = pgEnum("schedule_status", ["open", "closed", "cancelled"]);

/**
 * Product type enum
 * */

export const productTypeEnum = pgEnum("product_type", ["hotel", "package", "rental"]);

/**
 * Booking status enum
 * */

export const bookingStatusEnum = pgEnum("booking_status", [
    "pending_payment",
    "paid",
    "confirmed",
    "cancelled",
    "expired",
    "completed",
]);

/**
 * Status payment enum
*/

export const paymentStatusEnum = pgEnum("payment_status", [
    "pending",
    "settlement",
    "capture",
    "deny",
    "cancel",
    "expire",
    "refund",
    "failure",
]);