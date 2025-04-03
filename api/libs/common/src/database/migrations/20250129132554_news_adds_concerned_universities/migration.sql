-- CreateTable
CREATE TABLE "_NewsConcernedUniversities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NewsConcernedUniversities_AB_unique" ON "_NewsConcernedUniversities"("A", "B");

-- CreateIndex
CREATE INDEX "_NewsConcernedUniversities_B_index" ON "_NewsConcernedUniversities"("B");

-- AddForeignKey
ALTER TABLE "_NewsConcernedUniversities" ADD CONSTRAINT "_NewsConcernedUniversities_A_fkey" FOREIGN KEY ("A") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsConcernedUniversities" ADD CONSTRAINT "_NewsConcernedUniversities_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
