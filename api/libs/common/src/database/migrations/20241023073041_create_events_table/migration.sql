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
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title_text_content_id" TEXT NOT NULL,
    "content_text_content_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "image_id" TEXT,
    "image_credit" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "event_url" TEXT,
    "address" TEXT,
    "address_name" TEXT,
    "deep_link" TEXT,
    "with_subscription" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventsToProfiles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DiffusionLanguages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ConcernedUniversities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "events_image_id_key" ON "events"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "_EventsToProfiles_AB_unique" ON "_EventsToProfiles"("A", "B");

-- CreateIndex
CREATE INDEX "_EventsToProfiles_B_index" ON "_EventsToProfiles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiffusionLanguages_AB_unique" ON "_DiffusionLanguages"("A", "B");

-- CreateIndex
CREATE INDEX "_DiffusionLanguages_B_index" ON "_DiffusionLanguages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConcernedUniversities_AB_unique" ON "_ConcernedUniversities"("A", "B");

-- CreateIndex
CREATE INDEX "_ConcernedUniversities_B_index" ON "_ConcernedUniversities"("B");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "media_objects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_title_text_content_id_fkey" FOREIGN KEY ("title_text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_content_text_content_id_fkey" FOREIGN KEY ("content_text_content_id") REFERENCES "text_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToProfiles" ADD CONSTRAINT "_EventsToProfiles_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToProfiles" ADD CONSTRAINT "_EventsToProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiffusionLanguages" ADD CONSTRAINT "_DiffusionLanguages_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiffusionLanguages" ADD CONSTRAINT "_DiffusionLanguages_B_fkey" FOREIGN KEY ("B") REFERENCES "language_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcernedUniversities" ADD CONSTRAINT "_ConcernedUniversities_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcernedUniversities" ADD CONSTRAINT "_ConcernedUniversities_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
