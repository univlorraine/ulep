-- CreateTable
CREATE TABLE "proficiency_tests" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proficiency_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proficiency_questions" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "text_content_id" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proficiency_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "proficiency_tests_level_key" ON "proficiency_tests"("level");

-- AddForeignKey
ALTER TABLE "proficiency_questions" ADD CONSTRAINT "proficiency_questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "proficiency_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proficiency_questions" ADD CONSTRAINT "proficiency_questions_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
