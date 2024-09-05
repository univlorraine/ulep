-- CreateTable
CREATE TABLE "vocabulary_list" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creator_id" TEXT,
    "original_language_code_id" TEXT NOT NULL,
    "translation_language_code_id" TEXT NOT NULL,

    CONSTRAINT "vocabulary_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "vocabulary_list_id" TEXT NOT NULL,
    "pronunciation_word_id" TEXT,
    "pronunciation_translation_id" TEXT,

    CONSTRAINT "vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Editor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_pronunciation_word_id_key" ON "vocabulary"("pronunciation_word_id");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_pronunciation_translation_id_key" ON "vocabulary"("pronunciation_translation_id");

-- CreateIndex
CREATE UNIQUE INDEX "_Editor_AB_unique" ON "_Editor"("A", "B");

-- CreateIndex
CREATE INDEX "_Editor_B_index" ON "_Editor"("B");

-- AddForeignKey
ALTER TABLE "vocabulary_list" ADD CONSTRAINT "vocabulary_list_original_language_code_id_fkey" FOREIGN KEY ("original_language_code_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_list" ADD CONSTRAINT "vocabulary_list_translation_language_code_id_fkey" FOREIGN KEY ("translation_language_code_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_list" ADD CONSTRAINT "vocabulary_list_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_vocabulary_list_id_fkey" FOREIGN KEY ("vocabulary_list_id") REFERENCES "vocabulary_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_pronunciation_word_id_fkey" FOREIGN KEY ("pronunciation_word_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_pronunciation_translation_id_fkey" FOREIGN KEY ("pronunciation_translation_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Editor" ADD CONSTRAINT "_Editor_A_fkey" FOREIGN KEY ("A") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Editor" ADD CONSTRAINT "_Editor_B_fkey" FOREIGN KEY ("B") REFERENCES "vocabulary_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
