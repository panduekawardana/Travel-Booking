import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { packageSchedules } from "../db/schema/index.js";
import type { CreatePackageScheduleInput, UpdatePackageScheduleInput } from "../validation/package-schedule.schema.js";

export class PackageScheduleService {
  static async findByPackage(packageId: string) {
    return db.select().from(packageSchedules).where(eq(packageSchedules.packageId, packageId));
  }

  static async getById(id: string) {
    const [schedule] = await db.select().from(packageSchedules).where(eq(packageSchedules.id, id)).limit(1);
    return schedule ?? null;
  }

  static async create(packageId: string, input: CreatePackageScheduleInput) {
    const [schedule] = await db.insert(packageSchedules).values({
      packageId,
      departureDate: input.departureDate,
      returnDate: input.returnDate,
      pricePerPax: String(input.pricePerPax),
      quota: input.quota,
      status: input.status ?? "open",
    }).returning();
    return schedule ?? null;
  }

  static async update(id: string, input: UpdatePackageScheduleInput) {
    const data: Record<string, unknown> = { ...input };
    if (input.pricePerPax) data.pricePerPax = String(input.pricePerPax);
    const [schedule] = await db.update(packageSchedules)
      .set(data)
      .where(eq(packageSchedules.id, id))
      .returning();
    return schedule ?? null;
  }

  static async delete(id: string) {
    const [schedule] = await db.delete(packageSchedules).where(eq(packageSchedules.id, id)).returning();
    return schedule ?? null;
  }
}
