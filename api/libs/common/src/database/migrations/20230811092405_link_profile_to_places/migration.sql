-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "campus_id" TEXT;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;
