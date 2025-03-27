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

  - The primary key for the `learning_languages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `profiles_on_tandems` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `learning_languages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "profiles_on_tandems" DROP CONSTRAINT "profiles_on_tandems_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "profiles_on_tandems" DROP CONSTRAINT "profiles_on_tandems_tandem_id_fkey";

-- AlterTable
ALTER TABLE "learning_languages" DROP CONSTRAINT "learning_languages_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "tandem_id" TEXT,
ADD CONSTRAINT "learning_languages_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "profiles_on_tandems";

-- AddForeignKey
ALTER TABLE "learning_languages" ADD CONSTRAINT "learning_languages_tandem_id_fkey" FOREIGN KEY ("tandem_id") REFERENCES "tandems"("id") ON DELETE SET NULL ON UPDATE CASCADE;
