-- CreateTable
CREATE TABLE "text_content" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "text_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "text_content_id" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "translations_text_content_id_idx" ON "translations"("text_content_id");

-- CreateIndex
CREATE INDEX "translations_language_id_idx" ON "translations"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "translations_text_content_id_language_id_key" ON "translations"("text_content_id", "language_id");

-- AddForeignKey
ALTER TABLE "text_content" ADD CONSTRAINT "text_content_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
