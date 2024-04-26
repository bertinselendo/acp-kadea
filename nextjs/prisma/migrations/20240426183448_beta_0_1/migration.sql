/*
  Warnings:

  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Client_organizationId_key";

-- DropIndex
DROP INDEX "User_organizationId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;
