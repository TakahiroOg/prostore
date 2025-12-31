import { PrismaClient, Prisma } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import sampleData from "./sample-data";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  await prisma.product.createMany({ data: sampleData.products });
  //   for (const u of sampleData) {
  //     await prisma.user.create({ data: u });
  //   }
}

main();
