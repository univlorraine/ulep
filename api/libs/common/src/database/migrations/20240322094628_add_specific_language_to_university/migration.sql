-- CreateTable
CREATE TABLE "_LanguageCodesToOrganizations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageCodesToOrganizations_AB_unique" ON "_LanguageCodesToOrganizations"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageCodesToOrganizations_B_index" ON "_LanguageCodesToOrganizations"("B");

-- AddForeignKey
ALTER TABLE "_LanguageCodesToOrganizations" ADD CONSTRAINT "_LanguageCodesToOrganizations_A_fkey" FOREIGN KEY ("A") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageCodesToOrganizations" ADD CONSTRAINT "_LanguageCodesToOrganizations_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
