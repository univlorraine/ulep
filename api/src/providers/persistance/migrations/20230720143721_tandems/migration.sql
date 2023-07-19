-- CreateTable
CREATE TABLE "tandems" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "tandems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles_on_tandems" (
    "profileId" TEXT NOT NULL,
    "tandemId" TEXT NOT NULL,

    CONSTRAINT "profiles_on_tandems_pkey" PRIMARY KEY ("profileId","tandemId")
);

-- CreateIndex
CREATE INDEX "status" ON "tandems"("status");

-- AddForeignKey
ALTER TABLE "profiles_on_tandems" ADD CONSTRAINT "profiles_on_tandems_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles_on_tandems" ADD CONSTRAINT "profiles_on_tandems_tandemId_fkey" FOREIGN KEY ("tandemId") REFERENCES "tandems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
