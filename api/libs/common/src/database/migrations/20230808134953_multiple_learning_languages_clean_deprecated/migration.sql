/*
  Warnings:

  - You are about to drop the column `learning_language_code_id` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `profiles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_learning_language_code_id_fkey";

-- DropIndex
DROP INDEX "learning_language_code";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "learning_language_code_id",
DROP COLUMN "level";
