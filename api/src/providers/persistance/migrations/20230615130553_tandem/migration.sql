-- CreateTable
CREATE TABLE "Tandem" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tandem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileTandem" (
    "profileId" TEXT NOT NULL,
    "tandemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileTandem_pkey" PRIMARY KEY ("profileId")
);

-- AddForeignKey
ALTER TABLE "ProfileTandem" ADD CONSTRAINT "ProfileTandem_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileTandem" ADD CONSTRAINT "ProfileTandem_tandemId_fkey" FOREIGN KEY ("tandemId") REFERENCES "Tandem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
