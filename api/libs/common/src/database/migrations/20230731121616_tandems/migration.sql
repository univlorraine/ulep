-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "native_language_code_id" TEXT NOT NULL,
    "learning_language_code_id" TEXT,
    "level" TEXT NOT NULL,
    "learning_type" TEXT NOT NULL,
    "same_gender" BOOLEAN NOT NULL,
    "same_age" BOOLEAN NOT NULL,
    "meeting_frequency" TEXT NOT NULL,
    "bio" TEXT,
    "metadata" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mastered_languages" (
    "profile_id" TEXT NOT NULL,
    "language_code_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mastered_languages_pkey" PRIMARY KEY ("profile_id","language_code_id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "text_content_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interests" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "text_content_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interests_categories" (
    "id" TEXT NOT NULL,
    "text_content_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interests_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tandems" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tandems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles_on_tandems" (
    "profile_id" TEXT NOT NULL,
    "tandem_id" TEXT NOT NULL,

    CONSTRAINT "profiles_on_tandems_pkey" PRIMARY KEY ("profile_id","tandem_id")
);

-- CreateTable
CREATE TABLE "_GoalsToProfiles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InterestsToProfiles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "native_language_code" ON "profiles"("native_language_code_id");

-- CreateIndex
CREATE INDEX "learning_language_code" ON "profiles"("learning_language_code_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "status" ON "tandems"("status");

-- CreateIndex
CREATE UNIQUE INDEX "_GoalsToProfiles_AB_unique" ON "_GoalsToProfiles"("A", "B");

-- CreateIndex
CREATE INDEX "_GoalsToProfiles_B_index" ON "_GoalsToProfiles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InterestsToProfiles_AB_unique" ON "_InterestsToProfiles"("A", "B");

-- CreateIndex
CREATE INDEX "_InterestsToProfiles_B_index" ON "_InterestsToProfiles"("B");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_native_language_code_id_fkey" FOREIGN KEY ("native_language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_learning_language_code_id_fkey" FOREIGN KEY ("learning_language_code_id") REFERENCES "language_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mastered_languages" ADD CONSTRAINT "mastered_languages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mastered_languages" ADD CONSTRAINT "mastered_languages_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interests" ADD CONSTRAINT "interests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "interests_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interests" ADD CONSTRAINT "interests_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interests_categories" ADD CONSTRAINT "interests_categories_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles_on_tandems" ADD CONSTRAINT "profiles_on_tandems_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles_on_tandems" ADD CONSTRAINT "profiles_on_tandems_tandem_id_fkey" FOREIGN KEY ("tandem_id") REFERENCES "tandems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalsToProfiles" ADD CONSTRAINT "_GoalsToProfiles_A_fkey" FOREIGN KEY ("A") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalsToProfiles" ADD CONSTRAINT "_GoalsToProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestsToProfiles" ADD CONSTRAINT "_InterestsToProfiles_A_fkey" FOREIGN KEY ("A") REFERENCES "interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestsToProfiles" ADD CONSTRAINT "_InterestsToProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
