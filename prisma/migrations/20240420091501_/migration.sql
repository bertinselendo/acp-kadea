/*
  Warnings:

  - You are about to drop the column `organizationId` on the `TeamMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_clientID_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_organizationId_fkey";

-- DropIndex
DROP INDEX "TeamMember_organizationId_key";

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_organizationId_key" ON "User"("organizationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientID_fkey" FOREIGN KEY ("clientID") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
