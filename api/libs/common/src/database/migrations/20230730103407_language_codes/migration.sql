-- CreateTable
CREATE TABLE "language_codes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "language_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "language_codes_code_idx" ON "language_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "language_codes_name_key" ON "language_codes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "language_codes_code_key" ON "language_codes"("code");
