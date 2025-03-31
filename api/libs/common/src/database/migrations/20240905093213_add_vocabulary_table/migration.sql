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
CREATE TABLE "vocabulary_list" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creator_id" TEXT,
    "original_language_code_id" TEXT NOT NULL,
    "translation_language_code_id" TEXT NOT NULL,

    CONSTRAINT "vocabulary_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "vocabulary_list_id" TEXT NOT NULL,
    "pronunciation_word_id" TEXT,
    "pronunciation_translation_id" TEXT,

    CONSTRAINT "vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Editor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_pronunciation_word_id_key" ON "vocabulary"("pronunciation_word_id");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_pronunciation_translation_id_key" ON "vocabulary"("pronunciation_translation_id");

-- CreateIndex
CREATE UNIQUE INDEX "_Editor_AB_unique" ON "_Editor"("A", "B");

-- CreateIndex
CREATE INDEX "_Editor_B_index" ON "_Editor"("B");

-- AddForeignKey
ALTER TABLE "vocabulary_list" ADD CONSTRAINT "vocabulary_list_original_language_code_id_fkey" FOREIGN KEY ("original_language_code_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_list" ADD CONSTRAINT "vocabulary_list_translation_language_code_id_fkey" FOREIGN KEY ("translation_language_code_id") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_list" ADD CONSTRAINT "vocabulary_list_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_vocabulary_list_id_fkey" FOREIGN KEY ("vocabulary_list_id") REFERENCES "vocabulary_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_pronunciation_word_id_fkey" FOREIGN KEY ("pronunciation_word_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_pronunciation_translation_id_fkey" FOREIGN KEY ("pronunciation_translation_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Editor" ADD CONSTRAINT "_Editor_A_fkey" FOREIGN KEY ("A") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Editor" ADD CONSTRAINT "_Editor_B_fkey" FOREIGN KEY ("B") REFERENCES "vocabulary_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
