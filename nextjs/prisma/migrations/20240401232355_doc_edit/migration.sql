/*
  Warnings:

  - You are about to drop the column `description` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `usepastelLink` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the `Access` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `link` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Access" DROP CONSTRAINT "Access_projectId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "description",
DROP COLUMN "file",
DROP COLUMN "service",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "usepastelLink",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "link" TEXT NOT NULL;

-- DropTable
DROP TABLE "Access";

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "service" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "adminUrl" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
