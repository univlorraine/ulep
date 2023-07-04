-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STAFF', 'STUDENT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('SPEAK_LIKE_NATIVE', 'IMPROVE_LEVEL', 'ORAL_PRACTICE', 'PREPARE_TRAVEL_ABROAD', 'GET_CERTIFICATION');

-- CreateEnum
CREATE TYPE "MeetingFrequency" AS ENUM ('ONCE_A_WEEK', 'TWICE_A_WEEK', 'THREE_TIMES_A_WEEK', 'TWICE_A_MONTH', 'THREE_TIMES_A_MONTH');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "role" "Role" NOT NULL,
    "metadata" JSONB NOT NULL,
    "organizationId" TEXT NOT NULL,
    "nationalityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_nationalityId_fkey" FOREIGN KEY ("nationalityId") REFERENCES "CountryCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
