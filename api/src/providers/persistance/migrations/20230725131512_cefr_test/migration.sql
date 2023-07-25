-- CreateTable
CREATE TABLE "cefr_tests" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "cefr_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cefr_questions" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "testId" TEXT NOT NULL,

    CONSTRAINT "cefr_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cefr_tests_level_key" ON "cefr_tests"("level");

-- CreateIndex
CREATE INDEX "level" ON "cefr_tests"("level");

-- AddForeignKey
ALTER TABLE "cefr_questions" ADD CONSTRAINT "cefr_questions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "cefr_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
