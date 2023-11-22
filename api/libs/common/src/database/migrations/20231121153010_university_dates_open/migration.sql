/*
  Warnings:

  - Added the required column `closeServiceDate` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openServiceDate` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "closeServiceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "openServiceDate" TIMESTAMP(3) NOT NULL;
