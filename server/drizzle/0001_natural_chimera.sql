CREATE TYPE "public"."user_role" AS ENUM('admin', 'costumer');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'costumer' NOT NULL;