/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `media_objects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `media_objects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media_objects" ADD COLUMN     "profileId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "universityId" TEXT NOT NULL,
    "nationalityId" TEXT NOT NULL,
    "nativeLanguageCode" TEXT NOT NULL,
    "learningLanguageCode" TEXT NOT NULL,
    "learningLanguageLevel" TEXT NOT NULL,
    "preferencesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mastered_languages" (
    "profileId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,

    CONSTRAINT "mastered_languages_pkey" PRIMARY KEY ("profileId","languageCode")
);

-- CreateTable
CREATE TABLE "learning_preferences" (
    "id" TEXT NOT NULL,
    "sameGender" BOOLEAN NOT NULL,
    "remote" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "learning_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_preferencesId_key" ON "profiles"("preferencesId");

-- CreateIndex
CREATE INDEX "native_language_code" ON "profiles"("nativeLanguageCode");

-- CreateIndex
CREATE INDEX "learning_language_code" ON "profiles"("learningLanguageCode");

-- CreateIndex
CREATE INDEX "university_id" ON "profiles"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "media_objects_profileId_key" ON "media_objects"("profileId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_nationalityId_fkey" FOREIGN KEY ("nationalityId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_nativeLanguageCode_fkey" FOREIGN KEY ("nativeLanguageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_learningLanguageCode_fkey" FOREIGN KEY ("learningLanguageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_preferencesId_fkey" FOREIGN KEY ("preferencesId") REFERENCES "learning_preferences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mastered_languages" ADD CONSTRAINT "mastered_languages_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mastered_languages" ADD CONSTRAINT "mastered_languages_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_objects" ADD CONSTRAINT "media_objects_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
