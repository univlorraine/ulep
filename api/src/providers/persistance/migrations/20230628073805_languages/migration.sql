-- CreateTable
CREATE TABLE "NativeLanguage" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "languageCodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NativeLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningLanguage" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "languageCodeId" TEXT NOT NULL,
    "proficiencyLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NativeLanguage_profileId_key" ON "NativeLanguage"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "NativeLanguage_profileId_languageCodeId_key" ON "NativeLanguage"("profileId", "languageCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningLanguage_profileId_key" ON "LearningLanguage"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningLanguage_profileId_languageCodeId_key" ON "LearningLanguage"("profileId", "languageCodeId");

-- AddForeignKey
ALTER TABLE "NativeLanguage" ADD CONSTRAINT "NativeLanguage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NativeLanguage" ADD CONSTRAINT "NativeLanguage_languageCodeId_fkey" FOREIGN KEY ("languageCodeId") REFERENCES "LanguageCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningLanguage" ADD CONSTRAINT "LearningLanguage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningLanguage" ADD CONSTRAINT "LearningLanguage_languageCodeId_fkey" FOREIGN KEY ("languageCodeId") REFERENCES "LanguageCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
