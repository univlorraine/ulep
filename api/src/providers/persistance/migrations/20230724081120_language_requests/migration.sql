-- CreateTable
CREATE TABLE "language_requests" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "languageCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "language_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "language_requests_languageCode_userId_key" ON "language_requests"("languageCode", "userId");

-- AddForeignKey
ALTER TABLE "language_requests" ADD CONSTRAINT "language_requests_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_requests" ADD CONSTRAINT "language_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
