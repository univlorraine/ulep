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

/*
  Warnings:

  - You are about to drop the column `campus_id` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `certificate_option` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `learning_type` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `same_age` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `same_gender` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `specific_program` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `learning_type` to the `learning_languages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `same_age` to the `learning_languages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `same_gender` to the `learning_languages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_campus_id_fkey";

-- AlterTable
ALTER TABLE "learning_languages" ADD COLUMN     "campus_id" TEXT,
ADD COLUMN     "certificate_option" BOOLEAN,
ADD COLUMN     "learning_type" TEXT NOT NULL,
ADD COLUMN     "same_age" BOOLEAN NOT NULL,
ADD COLUMN     "same_gender" BOOLEAN NOT NULL,
ADD COLUMN     "specific_program" BOOLEAN;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "campus_id",
DROP COLUMN "certificate_option",
DROP COLUMN "learning_type",
DROP COLUMN "same_age",
DROP COLUMN "same_gender",
DROP COLUMN "specific_program";

-- AddForeignKey
ALTER TABLE "learning_languages" ADD CONSTRAINT "learning_languages_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;
