-- DropForeignKey
ALTER TABLE "LearningLanguage" DROP CONSTRAINT "LearningLanguage_languageCodeId_fkey";

-- DropForeignKey
ALTER TABLE "LearningLanguage" DROP CONSTRAINT "LearningLanguage_profileId_fkey";

-- DropForeignKey
ALTER TABLE "NativeLanguage" DROP CONSTRAINT "NativeLanguage_languageCodeId_fkey";

-- DropForeignKey
ALTER TABLE "NativeLanguage" DROP CONSTRAINT "NativeLanguage_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileMatch" DROP CONSTRAINT "ProfileMatch_matchId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileMatch" DROP CONSTRAINT "ProfileMatch_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileTandem" DROP CONSTRAINT "ProfileTandem_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileTandem" DROP CONSTRAINT "ProfileTandem_tandemId_fkey";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NativeLanguage" ADD CONSTRAINT "NativeLanguage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NativeLanguage" ADD CONSTRAINT "NativeLanguage_languageCodeId_fkey" FOREIGN KEY ("languageCodeId") REFERENCES "LanguageCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningLanguage" ADD CONSTRAINT "LearningLanguage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningLanguage" ADD CONSTRAINT "LearningLanguage_languageCodeId_fkey" FOREIGN KEY ("languageCodeId") REFERENCES "LanguageCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMatch" ADD CONSTRAINT "ProfileMatch_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMatch" ADD CONSTRAINT "ProfileMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileTandem" ADD CONSTRAINT "ProfileTandem_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileTandem" ADD CONSTRAINT "ProfileTandem_tandemId_fkey" FOREIGN KEY ("tandemId") REFERENCES "Tandem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
