import { pgEnum } from "drizzle-orm/pg-core";

// ALL ENUM
/**
 * ? Enum User Role
*/

export const userRoleEnum = pgEnum("user_role", [
    "admin", "costumer"
]);


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