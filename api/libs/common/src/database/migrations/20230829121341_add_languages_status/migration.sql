/*
  Warnings:

  - You are about to drop the `_LanguageCodesToOrganizations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LanguageCodesToOrganizations" DROP CONSTRAINT "_LanguageCodesToOrganizations_A_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageCodesToOrganizations" DROP CONSTRAINT "_LanguageCodesToOrganizations_B_fkey";

-- AlterTable
ALTER TABLE "language_codes" ADD COLUMN     "mainUniversityStatus" TEXT NOT NULL DEFAULT 'UNACTIVE',
ADD COLUMN     "secondaryUniversityActive" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_LanguageCodesToOrganizations";
