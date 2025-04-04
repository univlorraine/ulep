-- AlterTable
ALTER TABLE "learning_languages" ADD COLUMN     "has_priority" BOOLEAN;

-- CreateTable
CREATE TABLE "unmatched_learning_languages" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "purge_id" TEXT NOT NULL,
    "language_code_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unmatched_learning_languages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unmatched_learning_languages_user_id_language_code_id_key" ON "unmatched_learning_languages"("user_id", "language_code_id");

-- AddForeignKey
ALTER TABLE "unmatched_learning_languages" ADD CONSTRAINT "unmatched_learning_languages_purge_id_fkey" FOREIGN KEY ("purge_id") REFERENCES "purges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unmatched_learning_languages" ADD CONSTRAINT "unmatched_learning_languages_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
