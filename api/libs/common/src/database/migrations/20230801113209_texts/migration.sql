/*
  Warnings:

  - A unique constraint covering the columns `[text_content_id]` on the table `goals` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[text_content_id]` on the table `interests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[text_content_id]` on the table `interests_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[text_content_id]` on the table `proficiency_questions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[text_content_id]` on the table `report_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "goals_text_content_id_key" ON "goals"("text_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "interests_text_content_id_key" ON "interests"("text_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "interests_categories_text_content_id_key" ON "interests_categories"("text_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "proficiency_questions_text_content_id_key" ON "proficiency_questions"("text_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_categories_text_content_id_key" ON "report_categories"("text_content_id");
