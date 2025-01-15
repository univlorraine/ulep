-- CreateTable
CREATE TABLE "community_chat" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "central_language_id" TEXT NOT NULL,
    "partner_language_id" TEXT NOT NULL,

    CONSTRAINT "community_chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "community_chat" ADD CONSTRAINT "community_chat_central_language_id_fkey" FOREIGN KEY ("central_language_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_chat" ADD CONSTRAINT "community_chat_partner_language_id_fkey" FOREIGN KEY ("partner_language_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
