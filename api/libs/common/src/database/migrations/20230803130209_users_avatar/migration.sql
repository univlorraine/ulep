-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_image_id_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
