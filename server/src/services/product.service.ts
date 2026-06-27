import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { destinations, hotelRooms, hotels, packages, packageSchedules, productImages, products, rentals } from "../db/schema";
import { db } from "../db/db";
import type { CreateProductInput, UpdateProductInput, ProductQueryInput } from '../validation/product.schema';



export class ProductServices {
    static async findAll(query: ProductQueryInput) {
        const { type, status, destinationId, search, page, limit } = query;
        const offset = (page - 1) * limit;

        const whereCllauser = [];
        if (type) whereCllauser.push(eq(products.type, type as "hotel" | "package" | "rental"));
        if (status) whereCllauser.push(eq(products.status, status as "draft" | "published" | "archived"));
        if (destinationId) whereCllauser.push(eq(products.destinationId, destinationId));

        if (search) whereCllauser.push(ilike(products.title, `%${search}`));

        const where = whereCllauser.length > 0 ? and(...whereCllauser) : undefined;

        const [data, totalResult] = await Promise.all([
            db.select({
                id: products.id,
                type: products.type,
                title: products.title,
                slug: products.slug,
                description: products.description,
                thumbnailUrl: products.thumbnailUrl,
                status: products.status,
                destinationId: products.destinationId,
                destinationName: destinations.name,
                createdAt: products.createdAt,
                updatedAt: products.updatedAt,
            })
                .from(products)
                .leftJoin(destinations, eq(products.destinationId, destinations.id))
                .where(where)
                .orderBy(desc(products.createdAt))
                .limit(limit)
                .offset(offset),

            db.select({ count: sql<number>`count(*)` })
                .from(products)
                .where(where)
                .then(r => Number(r[0]?.count ?? 0))
        ]);

        return {
            data, pagination: {
                page, limit, total: totalResult, totalPages: Math.ceil(totalResult / limit)
            }
        };
    }

    // Get fing by id
    static async getById(id: string) {
        const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
        if (!product) return null;

        const result: Record<string, unknown> = { ...product };

        // get destination
        if (product.destinationId) {
            const [dest] = await db.select().from(destinations).where(eq(destinations.id, product.destinationId)).limit(1);
            result.destination = dest ?? null;
        }

        // Ambil images
        result.images = await db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(productImages.shortOrder);

        // Ambil sesuai data
        if (product.type === "hotel") {
            const [hotel] = await db.select().from(hotels).where(eq(hotels.productId, id)).limit(1);
            if (hotel) {
                const rooms = await db.select().from(hotelRooms).where(eq(hotelRooms.hotelId, hotel.productId));
                result.typeData = { ...hotel, rooms }
            }
        } else if (product.type === "package") {
            const [pkg] = await db.select().from(packages).where(eq(packages.productId, id)).limit(1);

            if (pkg) {
                const schedules = await db.select().from(packageSchedules).where(eq(packageSchedules.packageId, pkg.productId));
                result.typeData = { ...pkg, schedules };
            }
        } else if (product.type === "rental") {
            const [rental] = await db.select().from(rentals).where(eq(rentals.productId, id)).limit(1);
            result.typeData = rental ?? null;
        }
        return result;
    }

    // Create product
    static async createProduct(input: CreateProductInput) {
        const { images, ...productData } = input;

        // insert base product
        const [product] = await db.insert(products).values({
            title: productData.title,
            slug: productData.slug,
            description: productData.description ?? null,
            destinationId: productData.destinationId ?? null,
            thumbnailUrl: productData.thumbnailUrl ?? null,
            type: productData.type,
            status: "draft",
            createdBy: productData.createdBy,
        }).returning();

        if (!product) return null;

        // Inser type-specific data
        if (productData.type === "hotel") {
            await db.insert(hotels).values({
                productId: product.id,
                starRating: productData.starRating ?? null,
                address: productData.address,
                checkInTime: productData.checkInTime ?? "14:00:00",
                checkOutTime: productData.checkOutTime ?? "12:00:00",
                facilities: productData.facilities ?? [],
            });
        } else if (productData.type === "package") {
            await db.insert(packages).values({
                productId: product.id,
                durationDays: productData.durationDays,
                durationNights: productData.durationNights,
                itinerary: productData.itinerary ?? [],
                includeItems: productData.includeItems ?? [],
                excludeItems: productData.excludeItems ?? [],
                minPax: productData.minPax ?? 1,
            });
        } else if (productData.type === "rental") {
            await db.insert(rentals).values({
                productId: product.id,
                vehicleType: productData.vehicleType,
                capacity: productData.capacity,
                withDriver: productData.withDriver ?? false,
                transmission: productData.transmission ?? null,
                pricePerDay: String(productData.pricePerDay),
                totalUnits: productData.totalUnits ?? 1,
            });
        }

        if (images && images.length > 0) {
            await db.insert(productImages).values(
                images.map((url: string, i: number) => ({ productId: product.id, url, shortOrder: i }))
            );
        }

        return this.getById(product.id);
    }

    static async update(id: string, input: UpdateProductInput) {
        const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
        if (!existing) return null;

        const { images, ...productData } = input;
        const productType = existing.type;

        // Update base product
        if (Object.keys(productData).length > 0) {
            await db.update(products)
                .set({ ...productData, updatedAt: new Date() })
                .where(eq(products.id, id));
        }

        // Update type-specific data
        const typeFields = Object.fromEntries(
            Object.entries(productData).filter(([k]) =>
                ["starRating", "address", "checkInTime", "checkOutTime", "facilities",
                    "durationDays", "durationNights", "itinerary", "includeItems", "excludeItems", "minPax",
                    "vehicleType", "capacity", "withDriver", "transmission", "pricePerDay", "totalUnits"].includes(k)
            )
        );

        if (Object.keys(typeFields).length > 0) {
            if (productType === "hotel") {
                await db.update(hotels).set(typeFields as any).where(eq(hotels.productId, id));
            } else if (productType === "package") {
                await db.update(packages).set(typeFields as any).where(eq(packages.productId, id));
            } else if (productType === "rental") {
                const rentalData = { ...typeFields } as any;
                if (rentalData.pricePerDay) rentalData.pricePerDay = String(rentalData.pricePerDay);
                await db.update(rentals).set(rentalData).where(eq(rentals.productId, id));
            }
        }

        // Replace images if provided
        if (images) {
            await db.delete(productImages).where(eq(productImages.productId, id));
            if (images.length > 0) {
                await db.insert(productImages).values(
                    images.map((url: string, i: number) => ({ productId: id, url, shortOrder: i }))
                );
            }
        }

        return this.getById(id);
    }

    // DELETE
    static async delete(id: string) {
        const [product] = await db.delete(products).where(eq(products.id, id)).returning();
        return product ?? null;
    }

    // UPDATE STATUS
    static async updateStatus(id: string, status: "draft" | "published" | "archived") {
        const [product] = await db.update(products)
            .set({ status, updatedAt: new Date() })
            .where(eq(products.id, id))
            .returning();
        return product ?? null;
    }
}