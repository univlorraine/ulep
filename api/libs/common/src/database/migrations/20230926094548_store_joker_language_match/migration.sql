-- AlterTable
ALTER TABLE "learning_languages" ADD COLUMN     "tandem_language_code_id" TEXT;

-- AddForeignKey
ALTER TABLE "learning_languages" ADD CONSTRAINT "learning_languages_tandem_language_code_id_fkey" FOREIGN KEY ("tandem_language_code_id") REFERENCES "language_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
