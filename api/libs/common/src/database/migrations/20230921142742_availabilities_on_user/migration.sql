-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "availabilities" JSONB,
ADD COLUMN     "availabilities_note" TEXT,
ADD COLUMN     "availabilities_note_privacy" BOOLEAN;
