-- CreateTable
CREATE TABLE "RefusedTandems" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organizationsId" TEXT NOT NULL,

    CONSTRAINT "RefusedTandems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LearningLanguagesToRefusedTandems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LearningLanguagesToRefusedTandems_AB_unique" ON "_LearningLanguagesToRefusedTandems"("A", "B");

-- CreateIndex
CREATE INDEX "_LearningLanguagesToRefusedTandems_B_index" ON "_LearningLanguagesToRefusedTandems"("B");

-- AddForeignKey
ALTER TABLE "RefusedTandems" ADD CONSTRAINT "RefusedTandems_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningLanguagesToRefusedTandems" ADD CONSTRAINT "_LearningLanguagesToRefusedTandems_A_fkey" FOREIGN KEY ("A") REFERENCES "learning_languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningLanguagesToRefusedTandems" ADD CONSTRAINT "_LearningLanguagesToRefusedTandems_B_fkey" FOREIGN KEY ("B") REFERENCES "RefusedTandems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
