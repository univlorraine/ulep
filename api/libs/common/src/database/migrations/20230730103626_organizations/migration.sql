-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "language_code_id" TEXT NOT NULL,
    "country_code_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggested_languages" (
    "id" TEXT NOT NULL,
    "language_code_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "country_code_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suggested_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "admissionStartDate" TIMESTAMP(3) NOT NULL,
    "admissionEndDate" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "website" TEXT,
    "resource" TEXT,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "languages_country_code_id_idx" ON "languages"("country_code_id");

-- CreateIndex
CREATE INDEX "languages_language_code_id_idx" ON "languages"("language_code_id");

-- CreateIndex
CREATE INDEX "languages_organization_id_idx" ON "languages"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "languages_organization_id_language_code_id_country_code_id_key" ON "languages"("organization_id", "language_code_id", "country_code_id");

-- CreateIndex
CREATE UNIQUE INDEX "suggested_languages_language_code_id_user_id_key" ON "suggested_languages"("language_code_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "places_name_key" ON "places"("name");

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_country_code_id_fkey" FOREIGN KEY ("country_code_id") REFERENCES "country_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggested_languages" ADD CONSTRAINT "suggested_languages_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggested_languages" ADD CONSTRAINT "suggested_languages_country_code_id_fkey" FOREIGN KEY ("country_code_id") REFERENCES "country_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
