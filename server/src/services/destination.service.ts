import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { destinations } from "../db/schema/index.js";
import type { CreateDestinationInput, UpdateDestinationInput, QueryDestinationInput } from "../validation/destination.schema.js";

export class DestinationService {
  static async findAll(query: QueryDestinationInput) {
    const { search, page, limit } = query;
    const offset = (page - 1) * limit;

    const whereClauses = [];
    if (search) {
      whereClauses.push(ilike(destinations.name, `%${search}%`));
    }

    const where = whereClauses.length > 0 ? and(...whereClauses) : undefined;

    const [data, totalResult] = await Promise.all([
      db.select()
        .from(destinations)
        .where(where)
        .orderBy(desc(destinations.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(destinations)
        .where(where)
        .then(r => Number(r[0]?.count ?? 0)),
    ]);

    return {
      data,
      pagination: {
        page, limit, total: totalResult, totalPages: Math.ceil(totalResult / limit),
      },
    };
  }

  static async getById(id: string) {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id)).limit(1);
    return destination ?? null;
  }

  static async create(input: CreateDestinationInput) {
    const [destination] = await db.insert(destinations).values(input).returning();
    return destination ?? null;
  }

  static async update(id: string, input: UpdateDestinationInput) {
    const [destination] = await db.update(destinations)
      .set({ ...input, createdAt: undefined })
      .where(eq(destinations.id, id))
      .returning();
    return destination ?? null;
  }

  static async delete(id: string) {
    const [destination] = await db.delete(destinations).where(eq(destinations.id, id)).returning();
    return destination ?? null;
  }
}
