/*
  Warnings:

  - You are about to drop the column `resource` on the `organizations` table. All the data in the column will be lost.
  - Added the required column `country_code_id` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "resource",
ADD COLUMN     "codes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "country_code_id" TEXT NOT NULL,
ADD COLUMN     "domains" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_country_code_id_fkey" FOREIGN KEY ("country_code_id") REFERENCES "country_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
