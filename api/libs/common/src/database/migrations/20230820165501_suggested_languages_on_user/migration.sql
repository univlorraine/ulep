-- AddForeignKey
ALTER TABLE "suggested_languages" ADD CONSTRAINT "suggested_languages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
