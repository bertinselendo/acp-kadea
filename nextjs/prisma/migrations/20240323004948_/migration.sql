/*
  Warnings:

  - You are about to drop the `_ProjectToTeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToTeamMember" DROP CONSTRAINT "_ProjectToTeamMember_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTeamMember" DROP CONSTRAINT "_ProjectToTeamMember_B_fkey";

-- DropTable
DROP TABLE "_ProjectToTeamMember";

-- CreateTable
CREATE TABLE "_TeamMemberProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeamMemberProjects_AB_unique" ON "_TeamMemberProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamMemberProjects_B_index" ON "_TeamMemberProjects"("B");

-- AddForeignKey
ALTER TABLE "_TeamMemberProjects" ADD CONSTRAINT "_TeamMemberProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMemberProjects" ADD CONSTRAINT "_TeamMemberProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
