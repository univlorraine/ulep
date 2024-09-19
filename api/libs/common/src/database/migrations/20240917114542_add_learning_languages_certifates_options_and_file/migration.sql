/*
  Warnings:

  - A unique constraint covering the columns `[certificate_file_id]` on the table `learning_languages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "learning_languages" ADD COLUMN     "certificate_file_id" TEXT,
ADD COLUMN     "consulting_interview" BOOLEAN,
ADD COLUMN     "learning_journal" BOOLEAN,
ADD COLUMN     "shared_certificate" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "learning_languages_certificate_file_id_key" ON "learning_languages"("certificate_file_id");

-- AddForeignKey
ALTER TABLE "learning_languages" ADD CONSTRAINT "learning_languages_certificate_file_id_fkey" FOREIGN KEY ("certificate_file_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
