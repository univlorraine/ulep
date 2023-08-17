/*
  Warnings:

  - A unique constraint covering the columns `[image_id]` on the table `goals` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "image_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "goals_image_id_key" ON "goals"("image_id");

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
