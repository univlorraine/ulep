-- CreateTable
CREATE TABLE "learning_languages" (
    "profile_id" TEXT NOT NULL,
    "language_code_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "learning_languages_pkey" PRIMARY KEY ("profile_id","language_code_id")
);

-- AddForeignKey
ALTER TABLE "learning_languages" ADD CONSTRAINT "learning_languages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_languages" ADD CONSTRAINT "learning_languages_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
