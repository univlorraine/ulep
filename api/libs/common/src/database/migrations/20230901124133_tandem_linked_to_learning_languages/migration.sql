/*
  Warnings:

  - The primary key for the `learning_languages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `profiles_on_tandems` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `learning_languages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "profiles_on_tandems" DROP CONSTRAINT "profiles_on_tandems_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "profiles_on_tandems" DROP CONSTRAINT "profiles_on_tandems_tandem_id_fkey";

-- AlterTable
ALTER TABLE "learning_languages" DROP CONSTRAINT "learning_languages_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "tandem_id" TEXT,
ADD CONSTRAINT "learning_languages_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "profiles_on_tandems";

-- AddForeignKey
ALTER TABLE "learning_languages" ADD CONSTRAINT "learning_languages_tandem_id_fkey" FOREIGN KEY ("tandem_id") REFERENCES "tandems"("id") ON DELETE SET NULL ON UPDATE CASCADE;
