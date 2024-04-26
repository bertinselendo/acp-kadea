import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

let client;

if (process.env.NODE_ENV === "production") {
  client = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  client = global.prisma;
}

export const prisma = client;
