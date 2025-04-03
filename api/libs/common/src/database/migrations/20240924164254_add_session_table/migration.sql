-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "tandem_id" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_tandem_id_fkey" FOREIGN KEY ("tandem_id") REFERENCES "tandems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
