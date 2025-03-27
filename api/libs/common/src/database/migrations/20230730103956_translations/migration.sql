--
--   Copyright ou © ou Copr. Université de Lorraine, (2025)
--
--   Direction du Numérique de l'Université de Lorraine - SIED
--
--   Ce logiciel est un programme informatique servant à rendre accessible
--   sur mobile et sur internet l'application ULEP (University Language
--   Exchange Programme) aux étudiants et aux personnels des universités
--   parties prenantes.
--
--   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
--   et respectant les principes de diffusion des logiciels libres. Vous pouvez
--   utiliser, modifier et/ou redistribuer ce programme sous les conditions
--   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
--   sur le site "http://cecill.info".
--
--   En contrepartie de l'accessibilité au code source et des droits de copie,
--   de modification et de redistribution accordés par cette licence, il n'est
--   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
--   seule une responsabilité restreinte pèse sur l'auteur du programme, le
--   titulaire des droits patrimoniaux et les concédants successifs.
--
--   À cet égard, l'attention de l'utilisateur est attirée sur les risques
--   associés au chargement, à l'utilisation, à la modification et/ou au
--   développement et à la reproduction du logiciel par l'utilisateur étant
--   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
--   manipuler et qui le réserve donc à des développeurs et des professionnels
--   avertis possédant des connaissances informatiques approfondies. Les
--   utilisateurs sont donc invités à charger et à tester l'adéquation du
--   logiciel à leurs besoins dans des conditions permettant d'assurer la
--   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
--   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
--
--   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
--   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
--   termes.
--

-- CreateTable
CREATE TABLE "text_content" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "text_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "text_content_id" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "translations_text_content_id_idx" ON "translations"("text_content_id");

-- CreateIndex
CREATE INDEX "translations_language_id_idx" ON "translations"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "translations_text_content_id_language_id_key" ON "translations"("text_content_id", "language_id");

-- AddForeignKey
ALTER TABLE "text_content" ADD CONSTRAINT "text_content_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
