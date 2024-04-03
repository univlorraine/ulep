/*
  Warnings:

  - A unique constraint covering the columns `[image_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "image_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_image_id_key" ON "organizations"("image_id");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
