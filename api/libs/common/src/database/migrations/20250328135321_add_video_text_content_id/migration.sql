/*
  Warnings:

  - A unique constraint covering the columns `[video_text_content_id]` on the table `editos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `video_text_content_id` to the `editos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "editos" ADD COLUMN     "video_text_content_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "editos_video_text_content_id_key" ON "editos"("video_text_content_id");

-- AddForeignKey
ALTER TABLE "editos" ADD CONSTRAINT "editos_video_text_content_id_fkey" FOREIGN KEY ("video_text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
