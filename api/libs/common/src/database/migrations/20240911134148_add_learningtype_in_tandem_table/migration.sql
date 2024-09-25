/*
  Warnings:

  - Added the required column `learning_type` to the `tandems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tandems" ADD COLUMN     "learning_type" TEXT NOT NULL;
