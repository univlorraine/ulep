-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "pairing_mode" TEXT NOT NULL DEFAULT 'MANUAL';

-- CreateTable
CREATE TABLE "_OrganizationsToTandems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationsToTandems_AB_unique" ON "_OrganizationsToTandems"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationsToTandems_B_index" ON "_OrganizationsToTandems"("B");

-- AddForeignKey
ALTER TABLE "_OrganizationsToTandems" ADD CONSTRAINT "_OrganizationsToTandems_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationsToTandems" ADD CONSTRAINT "_OrganizationsToTandems_B_fkey" FOREIGN KEY ("B") REFERENCES "tandems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
