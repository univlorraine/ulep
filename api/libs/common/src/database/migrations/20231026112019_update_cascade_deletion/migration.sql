-- DropForeignKey
ALTER TABLE "learning_languages" DROP CONSTRAINT "learning_languages_profile_id_fkey";

-- AddForeignKey
ALTER TABLE "learning_languages" ADD CONSTRAINT "learning_languages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
