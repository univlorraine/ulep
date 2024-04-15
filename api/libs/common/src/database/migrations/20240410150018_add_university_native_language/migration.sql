/*
  Warnings:

  - You are about to drop the `_LanguageCodesToOrganizations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `language_code_id` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_LanguageCodesToOrganizations" DROP CONSTRAINT "_LanguageCodesToOrganizations_A_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageCodesToOrganizations" DROP CONSTRAINT "_LanguageCodesToOrganizations_B_fkey";

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "language_code_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_LanguageCodesToOrganizations";

-- CreateTable
CREATE TABLE "_SpecificLanguagesOrganizations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SpecificLanguagesOrganizations_AB_unique" ON "_SpecificLanguagesOrganizations"("A", "B");

-- CreateIndex
CREATE INDEX "_SpecificLanguagesOrganizations_B_index" ON "_SpecificLanguagesOrganizations"("B");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecificLanguagesOrganizations" ADD CONSTRAINT "_SpecificLanguagesOrganizations_A_fkey" FOREIGN KEY ("A") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecificLanguagesOrganizations" ADD CONSTRAINT "_SpecificLanguagesOrganizations_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
