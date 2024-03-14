import { PrismaClient } from "@prisma/client";

export const prisma = () => {
  const prisma = new PrismaClient();
  return prisma;
};
