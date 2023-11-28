-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_userId_fkey";

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "purges" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blacklist" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tandem_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "purge_id" TEXT NOT NULL,
    "tandem_id" TEXT NOT NULL,
    "language_code_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tandem_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklist_user_id_key" ON "blacklist"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tandem_history_user_id_tandem_id_key" ON "tandem_history"("user_id", "tandem_id");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tandem_history" ADD CONSTRAINT "tandem_history_purge_id_fkey" FOREIGN KEY ("purge_id") REFERENCES "purges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
