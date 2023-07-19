-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "avatarId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_objects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_objects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_avatarId_key" ON "users"("avatarId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "media_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
