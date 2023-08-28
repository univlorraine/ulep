/*
  Warnings:

  - You are about to drop the column `deactivated` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "deactivated",
ADD COLUMN     "status" TEXT;
