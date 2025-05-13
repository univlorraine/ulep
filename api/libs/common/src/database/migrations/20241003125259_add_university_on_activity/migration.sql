/*
  Warnings:

  - Added the required column `university_id` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_creator_id_fkey";

-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "university_id" TEXT NOT NULL,
ALTER COLUMN "creator_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
