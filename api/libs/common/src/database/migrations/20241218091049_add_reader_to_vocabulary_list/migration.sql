-- CreateTable
CREATE TABLE "_Reader" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Reader_AB_unique" ON "_Reader"("A", "B");

-- CreateIndex
CREATE INDEX "_Reader_B_index" ON "_Reader"("B");

-- AddForeignKey
ALTER TABLE "_Reader" ADD CONSTRAINT "_Reader_A_fkey" FOREIGN KEY ("A") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Reader" ADD CONSTRAINT "_Reader_B_fkey" FOREIGN KEY ("B") REFERENCES "vocabulary_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
