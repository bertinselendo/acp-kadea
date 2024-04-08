/*
  Warnings:

  - You are about to drop the column `amount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNumber` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `issueDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "amount",
DROP COLUMN "description",
DROP COLUMN "invoiceNumber",
DROP COLUMN "issueDate",
DROP COLUMN "type",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
