-- DropForeignKey
ALTER TABLE "mastered_languages" DROP CONSTRAINT "mastered_languages_profile_id_fkey";

-- AddForeignKey
ALTER TABLE "mastered_languages" ADD CONSTRAINT "mastered_languages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
