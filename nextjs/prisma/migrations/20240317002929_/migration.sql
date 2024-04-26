/*
  Warnings:

  - You are about to drop the column `internalNotes` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "internalNotes",
ADD COLUMN     "internalNote" TEXT;
