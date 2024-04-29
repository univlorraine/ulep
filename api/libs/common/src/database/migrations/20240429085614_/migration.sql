/*
  Warnings:

  - A unique constraint covering the columns `[default_contact_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "default_contact_id" TEXT,

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "contact_id" TEXT;

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_default_contact_id_key" ON "organizations"("default_contact_id");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_default_contact_id_fkey" FOREIGN KEY ("default_contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
