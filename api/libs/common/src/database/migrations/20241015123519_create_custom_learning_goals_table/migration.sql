-- CreateTable
CREATE TABLE "learning_goals" (
    "id" TEXT NOT NULL,
    "learning_language_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_goals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learning_goals" ADD CONSTRAINT "learning_goals_learning_language_id_fkey" FOREIGN KEY ("learning_language_id") REFERENCES "learning_languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
