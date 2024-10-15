-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title_text_content_id" TEXT NOT NULL,
    "content_text_content_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "image_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "event_url" TEXT,
    "address" TEXT,
    "address_name" TEXT,
    "deep_link" TEXT,
    "with_subscription" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventsToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DiffusionLanguages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ConcernedUniversities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "events_image_id_key" ON "events"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "_EventsToUsers_AB_unique" ON "_EventsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_EventsToUsers_B_index" ON "_EventsToUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiffusionLanguages_AB_unique" ON "_DiffusionLanguages"("A", "B");

-- CreateIndex
CREATE INDEX "_DiffusionLanguages_B_index" ON "_DiffusionLanguages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConcernedUniversities_AB_unique" ON "_ConcernedUniversities"("A", "B");

-- CreateIndex
CREATE INDEX "_ConcernedUniversities_B_index" ON "_ConcernedUniversities"("B");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_title_text_content_id_fkey" FOREIGN KEY ("title_text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_content_text_content_id_fkey" FOREIGN KEY ("content_text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToUsers" ADD CONSTRAINT "_EventsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToUsers" ADD CONSTRAINT "_EventsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiffusionLanguages" ADD CONSTRAINT "_DiffusionLanguages_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiffusionLanguages" ADD CONSTRAINT "_DiffusionLanguages_B_fkey" FOREIGN KEY ("B") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcernedUniversities" ADD CONSTRAINT "_ConcernedUniversities_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcernedUniversities" ADD CONSTRAINT "_ConcernedUniversities_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
