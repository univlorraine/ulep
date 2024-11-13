-- CreateEnum
CREATE TYPE "LogEntryType" AS ENUM ('CONNECTION', 'VISIO', 'TANDEM_CHAT', 'COMMUNITY_CHAT', 'CUSTOM_ENTRY', 'SHARING_LOGS', 'ADD_VOCABULARY', 'SHARE_VOCABULARY', 'EDIT_ACTIVITY', 'SUBMIT_ACTIVITY', 'PLAYED_GAME');

-- CreateTable
CREATE TABLE "log_entry" (
    "id" TEXT NOT NULL,
    "type" "LogEntryType" NOT NULL,
    "metadata" JSONB,
    "user_id" TEXT NOT NULL,
    "is_shared" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "log_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_entry_user_id_key" ON "log_entry"("user_id");

-- AddForeignKey
ALTER TABLE "log_entry" ADD CONSTRAINT "log_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
