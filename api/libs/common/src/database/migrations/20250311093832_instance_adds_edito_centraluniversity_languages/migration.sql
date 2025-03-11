-- CreateTable
CREATE TABLE "_EditoCentralUniversityTranslations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EditoCentralUniversityTranslations_AB_unique" ON "_EditoCentralUniversityTranslations"("A", "B");

-- CreateIndex
CREATE INDEX "_EditoCentralUniversityTranslations_B_index" ON "_EditoCentralUniversityTranslations"("B");

-- AddForeignKey
ALTER TABLE "_EditoCentralUniversityTranslations" ADD CONSTRAINT "_EditoCentralUniversityTranslations_A_fkey" FOREIGN KEY ("A") REFERENCES "Instance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditoCentralUniversityTranslations" ADD CONSTRAINT "_EditoCentralUniversityTranslations_B_fkey" FOREIGN KEY ("B") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
