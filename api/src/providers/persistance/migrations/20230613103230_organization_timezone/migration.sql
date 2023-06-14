/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `CountryCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CountryCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admissionEnd` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admissionStart` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CountryCode" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "admissionEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "admissionStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "countryId" TEXT NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CountryCode_code_key" ON "CountryCode"("code");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "CountryCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
