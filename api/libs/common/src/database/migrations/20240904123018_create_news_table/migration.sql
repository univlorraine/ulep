-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title_text_content_id" TEXT NOT NULL,
    "content_text_content_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "image_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_image_id_key" ON "News"("image_id");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_title_text_content_id_fkey" FOREIGN KEY ("title_text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_content_text_content_id_fkey" FOREIGN KEY ("content_text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
