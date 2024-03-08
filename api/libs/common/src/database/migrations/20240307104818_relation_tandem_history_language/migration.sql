-- AddForeignKey
ALTER TABLE "tandem_history" ADD CONSTRAINT "tandem_history_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
