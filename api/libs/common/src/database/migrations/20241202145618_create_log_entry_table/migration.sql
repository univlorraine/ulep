-- CreateEnum
CREATE TYPE "LogEntryType" AS ENUM ('CONNECTION', 'VISIO', 'TANDEM_CHAT', 'COMMUNITY_CHAT', 'CUSTOM_ENTRY', 'SHARING_LOGS', 'ADD_VOCABULARY', 'SHARE_VOCABULARY', 'EDIT_ACTIVITY', 'SUBMIT_ACTIVITY', 'PLAYED_GAME');

-- AlterTable
ALTER TABLE "learning_languages" ADD COLUMN     "shared_logs_date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "log_entry" (
    "id" TEXT NOT NULL,
    "type" "LogEntryType" NOT NULL,
    "metadata" JSONB,
    "learning_language_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "log_entry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "log_entry" ADD CONSTRAINT "log_entry_learning_language_id_fkey" FOREIGN KEY ("learning_language_id") REFERENCES "learning_languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
