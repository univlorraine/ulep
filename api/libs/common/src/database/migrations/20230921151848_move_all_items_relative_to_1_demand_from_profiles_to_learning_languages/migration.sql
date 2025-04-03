/*
  Warnings:

  - You are about to drop the column `campus_id` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `certificate_option` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `learning_type` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `same_age` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `same_gender` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `specific_program` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `learning_type` to the `learning_languages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `same_age` to the `learning_languages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `same_gender` to the `learning_languages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_campus_id_fkey";

-- AlterTable
ALTER TABLE "learning_languages" ADD COLUMN     "campus_id" TEXT,
ADD COLUMN     "certificate_option" BOOLEAN,
ADD COLUMN     "learning_type" TEXT NOT NULL,
ADD COLUMN     "same_age" BOOLEAN NOT NULL,
ADD COLUMN     "same_gender" BOOLEAN NOT NULL,
ADD COLUMN     "specific_program" BOOLEAN;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "campus_id",
DROP COLUMN "certificate_option",
DROP COLUMN "learning_type",
DROP COLUMN "same_age",
DROP COLUMN "same_gender",
DROP COLUMN "specific_program";

-- AddForeignKey
ALTER TABLE "learning_languages" ADD CONSTRAINT "learning_languages_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;
