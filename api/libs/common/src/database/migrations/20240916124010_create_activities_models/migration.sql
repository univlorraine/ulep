-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "credit_image" TEXT,
    "image_id" TEXT,
    "language_code_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_themes" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "text_content_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_themes_categories" (
    "id" TEXT NOT NULL,
    "text_content_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_themes_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_vocabulary" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "pronunciation_activity_vocabulary_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_exercises" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "activity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activity_image_id_key" ON "activity"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_themes_text_content_id_key" ON "activity_themes"("text_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_themes_categories_text_content_id_key" ON "activity_themes_categories"("text_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_vocabulary_pronunciation_activity_vocabulary_id_key" ON "activity_vocabulary"("pronunciation_activity_vocabulary_id");

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_themes" ADD CONSTRAINT "activity_themes_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_themes" ADD CONSTRAINT "activity_themes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "activity_themes_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_themes_categories" ADD CONSTRAINT "activity_themes_categories_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_vocabulary" ADD CONSTRAINT "activity_vocabulary_pronunciation_activity_vocabulary_id_fkey" FOREIGN KEY ("pronunciation_activity_vocabulary_id") REFERENCES "media_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_vocabulary" ADD CONSTRAINT "activity_vocabulary_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_exercises" ADD CONSTRAINT "activity_exercises_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
