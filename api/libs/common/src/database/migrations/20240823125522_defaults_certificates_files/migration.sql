/*
  Warnings:

  - A unique constraint covering the columns `[default_certificate_file_id]` on the table `Instance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[default_certificate_file_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Instance" ADD COLUMN     "default_certificate_file_id" TEXT;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "default_certificate_file_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Instance_default_certificate_file_id_key" ON "Instance"("default_certificate_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_default_certificate_file_id_key" ON "organizations"("default_certificate_file_id");

-- AddForeignKey
ALTER TABLE "Instance" ADD CONSTRAINT "Instance_default_certificate_file_id_fkey" FOREIGN KEY ("default_certificate_file_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_default_certificate_file_id_fkey" FOREIGN KEY ("default_certificate_file_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
