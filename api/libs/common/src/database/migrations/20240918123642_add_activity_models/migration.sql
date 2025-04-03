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
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "credit_image" TEXT,
    "image_id" TEXT,
    "language_level" TEXT NOT NULL,
    "language_code_id" TEXT NOT NULL,
    "activity_theme_id" TEXT NOT NULL,
    "ressource_url" TEXT,
    "ressource_file_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_themes" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "text_content_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_themes_categories" (
    "id" TEXT NOT NULL,
    "text_content_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_themes_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_vocabulary" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "pronunciation_activity_vocabulary_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_exercises" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "activity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activity_image_id_key" ON "activity"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_ressource_file_id_key" ON "activity"("ressource_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_themes_text_content_id_key" ON "activity_themes"("text_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_themes_categories_text_content_id_key" ON "activity_themes_categories"("text_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_vocabulary_pronunciation_activity_vocabulary_id_key" ON "activity_vocabulary"("pronunciation_activity_vocabulary_id");

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_ressource_file_id_fkey" FOREIGN KEY ("ressource_file_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_language_code_id_fkey" FOREIGN KEY ("language_code_id") REFERENCES "language_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_activity_theme_id_fkey" FOREIGN KEY ("activity_theme_id") REFERENCES "activity_themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_themes" ADD CONSTRAINT "activity_themes_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_themes" ADD CONSTRAINT "activity_themes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "activity_themes_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_themes_categories" ADD CONSTRAINT "activity_themes_categories_text_content_id_fkey" FOREIGN KEY ("text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_vocabulary" ADD CONSTRAINT "activity_vocabulary_pronunciation_activity_vocabulary_id_fkey" FOREIGN KEY ("pronunciation_activity_vocabulary_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_vocabulary" ADD CONSTRAINT "activity_vocabulary_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_exercises" ADD CONSTRAINT "activity_exercises_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
