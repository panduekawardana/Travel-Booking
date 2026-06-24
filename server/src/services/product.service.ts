import { eq } from "drizzle-orm/sql/expressions/conditions";
import { db } from "../db/db.js";
import {
  products,
  productImages,
  hotels,
  hotelRooms,
  packages,
  packageSchedules,
  rentals,
} from "../db/schema/index.js";

import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from "../validation/product.schema.js";
import { like, and, asc, desc, count } from 'drizzle-orm';

export class ProductService {
  static async findAll(filters: ProductQueryInput) {
    try {
      const conditions = [];

      if (filters.type) conditions.push(eq(products.type, filters.type));
      if (filters.status) conditions.push(eq(products.status, filters.status));
      if (filters.destinationId) conditions.push(eq(products.destinationId, filters.destinationId));
      if (filters.search) conditions.push(like(products.title, `%${filters.search}%`));

      const data = await db.query.products.findMany({
        where: and(...conditions),
        with: {
          destination: true,
          createdByUser: { columns: { id: true, name: true, email: true } },
          images: { orderBy: [asc(productImages.shortOrder)] },
        },
        limit: filters.limit,
        offset: (filters.page - 1) * filters.limit,
        orderBy: [desc(products.createdAt)],
      });

      const [totalResult] = await db
        .select({ count: count() })
        .from(products)
        .where(and(...conditions));

      return {
        data,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: Number(totalResult!.count),
          totalPages: Math.ceil(Number(totalResult!.count) / filters.limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error}`);
    }
  }

  static async findById(id: string) {
    try {
      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
          destination: true,
          createdByUser: { columns: { id: true, name: true, email: true } },
          images: { orderBy: [asc(productImages.shortOrder)] },
        },
      });

      if (!product) return null;

      const detailLoaders = {
        hotel:  () => db.query.hotels.findFirst({ where: eq(hotels.productId, id), with: { rooms: { with: { inventory: true } } } }),
        package: () => db.query.packages.findFirst({ where: eq(packages.productId, id), with: { schedules: true } }),
        rental:  () => db.query.rentals.findFirst({ where: eq(rentals.productId, id) }),
      } as const;

      const loader = detailLoaders[product.type as keyof typeof detailLoaders];
      const detail = loader ? await loader() : null;

      return { ...product, detail };
    } catch (error) {
      throw new Error(`Failed to find product: ${error}`);
    }
  }

  static async create(input: CreateProductInput, createdBy: string) {
    try {
      const result = await db.transaction(async (tx) => {
        const [product] = await tx
          .insert(products)
          .values({
            type: input.type,
            title: input.title,
            slug: input.slug,
            description: input.description,
            destinationId: input.destinationId,
            thumbnailUrl: input.thumbnailUrl,
            createdBy,
          })
          .returning();

        if (!product) throw new Error("Failed to create product");

        switch (input.type) {
          case "hotel":
            await tx.insert(hotels).values({
              productId: product.id,
              starRating: input.starRating,
              address: input.address,
              checkInTime: input.checkInTime,
              checkOutTime: input.checkOutTime,
              facilities: input.facilities ?? [],
            });
            break;

          case "package":
            await tx.insert(packages).values({
              productId: product.id,
              durationDays: input.durationDays,
              durationNights: input.durationNights,
              itinerary: input.itinerary ?? [],
              includeItems: input.includeItems ?? [],
              excludeItems: input.excludeItems ?? [],
              minPax: input.minPax,
            });
            break;

          case "rental":
            await tx.insert(rentals).values({
              productId: product.id,
              vehicleType: input.vehicleType,
              capacity: input.capacity,
              withDriver: input.withDriver,
              transmission: input.transmission,
              pricePerDay: String(input.pricePerDay),
              totalUnits: input.totalUnits,
            });
            break;
        }

        if (input.images?.length) {
          await tx.insert(productImages).values(
            input.images.map((url: string, i: number) => ({
              productId: product.id,
              url,
              shortOrder: i,
            }))
          );
        }

        return product;
      });

      return this.findById(result.id);
    } catch (error) {
      throw new Error(`Failed to create product: ${error}`);
    }
  }

  static async update(id: string, input: UpdateProductInput) {
    try {
      const [product] = await db
        .update(products)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();

      if (!product) return null;

      return this.findById(product.id);
    } catch (error) {
      throw new Error(`Failed to update product: ${error}`);
    }
  }

  static async delete(id: string) {
    try {
      const [product] = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning({ id: products.id });

      return product ?? null;
    } catch (error) {
      throw new Error(`Failed to delete product: ${error}`);
    }
  }
}
