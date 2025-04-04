-- CreateTable
CREATE TABLE "RoutineExecutions" (
    "id" TEXT NOT NULL,
    "sponsor_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoutineExecutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganizationsToRoutineExecutions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationsToRoutineExecutions_AB_unique" ON "_OrganizationsToRoutineExecutions"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationsToRoutineExecutions_B_index" ON "_OrganizationsToRoutineExecutions"("B");

-- AddForeignKey
ALTER TABLE "_OrganizationsToRoutineExecutions" ADD CONSTRAINT "_OrganizationsToRoutineExecutions_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationsToRoutineExecutions" ADD CONSTRAINT "_OrganizationsToRoutineExecutions_B_fkey" FOREIGN KEY ("B") REFERENCES "RoutineExecutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
