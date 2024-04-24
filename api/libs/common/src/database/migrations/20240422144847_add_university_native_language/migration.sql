-- AlterTable
ALTER TABLE "organizations" ADD COLUMN "language_code_id" TEXT;

-- Update all existing organizations with a default language code to French
UPDATE "organizations" SET ("language_code_id") = (SELECT id FROM "language_codes" WHERE code = 'fr');

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "language_code_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;