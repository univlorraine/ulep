-- CreateTable
CREATE TABLE "country_codes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "country_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "country_codes_code_idx" ON "country_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "country_codes_name_key" ON "country_codes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "country_codes_code_key" ON "country_codes"("code");
