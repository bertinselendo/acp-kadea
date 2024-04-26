/*
  Warnings:

  - You are about to drop the column `sector` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "sector",
ADD COLUMN     "categorie" TEXT;
