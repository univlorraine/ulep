/*
  Warnings:

  - You are about to drop the `_GoalsToProfiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GoalsToProfiles" DROP CONSTRAINT "_GoalsToProfiles_A_fkey";

-- DropForeignKey
ALTER TABLE "_GoalsToProfiles" DROP CONSTRAINT "_GoalsToProfiles_B_fkey";

-- DropTable
DROP TABLE "_GoalsToProfiles";

-- CreateTable
CREATE TABLE "_LearningObjectivesToProfiles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LearningObjectivesToProfiles_AB_unique" ON "_LearningObjectivesToProfiles"("A", "B");

-- CreateIndex
CREATE INDEX "_LearningObjectivesToProfiles_B_index" ON "_LearningObjectivesToProfiles"("B");

-- AddForeignKey
ALTER TABLE "_LearningObjectivesToProfiles" ADD CONSTRAINT "_LearningObjectivesToProfiles_A_fkey" FOREIGN KEY ("A") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningObjectivesToProfiles" ADD CONSTRAINT "_LearningObjectivesToProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
