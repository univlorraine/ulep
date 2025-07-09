/*
  Warnings:

  - Made the column `video_text_content_id` on table `editos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "editos" ALTER COLUMN "video_text_content_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "learning_goals" ALTER COLUMN "description" DROP NOT NULL;
