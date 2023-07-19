-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "admissionStart" TIMESTAMP(3) NOT NULL,
    "admissionEnd" TIMESTAMP(3) NOT NULL,
    "resourcesUrl" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" TEXT,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "Campus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities_languages" (
    "universityId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,

    CONSTRAINT "universities_languages_pkey" PRIMARY KEY ("universityId","languageCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "universities_name_key" ON "universities"("name");

-- AddForeignKey
ALTER TABLE "universities" ADD CONSTRAINT "universities_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campus" ADD CONSTRAINT "Campus_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "universities_languages" ADD CONSTRAINT "universities_languages_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "universities_languages" ADD CONSTRAINT "universities_languages_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;
