-- AlterTable
ALTER TABLE "Instance" ADD COLUMN     "edito_mandatory_translations" TEXT[];

-- CreateTable
CREATE TABLE "editos" (
    "id" TEXT NOT NULL,
    "content_text_content_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "image_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "editos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "editos_content_text_content_id_key" ON "editos"("content_text_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "editos_university_id_key" ON "editos"("university_id");

-- CreateIndex
CREATE UNIQUE INDEX "editos_image_id_key" ON "editos"("image_id");

-- AddForeignKey
ALTER TABLE "editos" ADD CONSTRAINT "editos_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "editos" ADD CONSTRAINT "editos_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "editos" ADD CONSTRAINT "editos_content_text_content_id_fkey" FOREIGN KEY ("content_text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
