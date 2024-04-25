-- Création d'une fonction pour obtenir l'ID
CREATE OR REPLACE FUNCTION get_language_code_id()
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT id FROM "language_codes" WHERE code = 'fr');
END;
$$ LANGUAGE plpgsql;

ALTER TABLE "organizations" ADD COLUMN "language_code_id" TEXT DEFAULT get_language_code_id() NOT NULL;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
