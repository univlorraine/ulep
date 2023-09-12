/*
  Warnings:

  - You are about to drop the column `country_code_id` on the `suggested_languages` table. All the data in the column will be lost.
  - You are about to drop the `languages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "languages" DROP CONSTRAINT "languages_country_code_id_fkey";

-- DropForeignKey
ALTER TABLE "languages" DROP CONSTRAINT "languages_language_code_id_fkey";

-- DropForeignKey
ALTER TABLE "languages" DROP CONSTRAINT "languages_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "suggested_languages" DROP CONSTRAINT "suggested_languages_country_code_id_fkey";

-- AlterTable
ALTER TABLE "suggested_languages" DROP COLUMN "country_code_id";

-- DropTable
DROP TABLE "languages";

-- CreateTable
CREATE TABLE "_LanguageCodesToOrganizations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageCodesToOrganizations_AB_unique" ON "_LanguageCodesToOrganizations"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageCodesToOrganizations_B_index" ON "_LanguageCodesToOrganizations"("B");

-- AddForeignKey
ALTER TABLE "_LanguageCodesToOrganizations" ADD CONSTRAINT "_LanguageCodesToOrganizations_A_fkey" FOREIGN KEY ("A") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageCodesToOrganizations" ADD CONSTRAINT "_LanguageCodesToOrganizations_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
