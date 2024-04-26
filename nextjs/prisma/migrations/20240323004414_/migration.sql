/*
  Warnings:

  - You are about to drop the column `budget` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `endedDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `startedDate` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "budget",
DROP COLUMN "endedDate",
DROP COLUMN "startedDate",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "priority" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "tags" TEXT;

-- CreateTable
CREATE TABLE "_ProjectToTeamMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTeamMember_AB_unique" ON "_ProjectToTeamMember"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTeamMember_B_index" ON "_ProjectToTeamMember"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToTeamMember" ADD CONSTRAINT "_ProjectToTeamMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTeamMember" ADD CONSTRAINT "_ProjectToTeamMember_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
