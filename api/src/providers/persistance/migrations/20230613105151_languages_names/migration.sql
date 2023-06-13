/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `LanguageCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `LanguageCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LanguageCode" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LanguageCode_code_key" ON "LanguageCode"("code");
