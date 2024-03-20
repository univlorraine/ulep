/*
  Warnings:

  - Added the required column `user_email` to the `tandem_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tandem_history" ADD COLUMN     "user_email" TEXT NOT NULL;
