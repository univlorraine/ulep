/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `MediaObject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `MediaObject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MediaObject" ADD COLUMN     "profileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MediaObject_profileId_key" ON "MediaObject"("profileId");

-- AddForeignKey
ALTER TABLE "MediaObject" ADD CONSTRAINT "MediaObject_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
