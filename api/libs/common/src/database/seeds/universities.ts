/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { PrismaClient } from '@prisma/client';
import { PairingMode } from '../../../../../src/core/models';

export const createCentralUniversityPlaceholder = async (
  prisma: PrismaClient,
) => {
  const countries = await prisma.countryCodes.findMany();
  const languageCodes = await prisma.languageCodes.findMany();
  const now = new Date();

  await prisma.organizations.create({
    data: {
      name: 'Central university',
      Country: {
        connect: { id: countries.find((country) => country.code === 'FR').id },
      },
      timezone: 'Europe/Paris',
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
      NativeLanguage: {
        connect: {
          id: languageCodes.find((language) => language.code === 'fr').id,
        },
      },
    },
  });
};

export enum UniversitySeedIDs {
  CENTRAL = 'b511f9d1-ce7e-40b5-a630-ecb99f4e9f59',
  BIRMINGHAM = '60ea6e0d-e654-47bf-9bbf-58b3c375b339',
  FRANCFORT = '0747d187-7b02-479b-8ce3-faccac2a20c9',
  OTTAWA = '1d9f3c9f-0408-46a6-ba1e-b934a4be6b14',
}

export const createUniversities = async (prisma: PrismaClient) => {
  const countries = await prisma.countryCodes.findMany();
  const languageCodes = await prisma.languageCodes.findMany();
  const now = new Date();

  await prisma.organizations.create({
    data: {
      id: UniversitySeedIDs.CENTRAL,
      name: 'Université de Lorraine',
      Country: {
        connect: { id: countries.find((country) => country.code === 'FR').id },
      },
      Places: {
        create: [
          {
            id: '681fc6e9-52f6-43c5-8606-b119f7bb32b5',
            name: 'Campus principal',
          },
          {
            id: 'f2f19eeb-fdf6-46a4-a69d-3bc686f843cb',
            name: 'campus Strasbourg',
          },
        ],
      },
      codes: ['23LORRAINE'],
      domains: ['@univ-lorraine.fr'],
      timezone: 'Europe/Paris',
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
      website: 'https://www.univ-lorraine.fr/',
      notification_email: 'notification+lorraine@test.fr',
      NativeLanguage: {
        connect: {
          id: languageCodes.find((language) => language.code === 'fr').id,
        },
      },
    },
  });

  await prisma.organizations.create({
    data: {
      id: UniversitySeedIDs.BIRMINGHAM,
      name: 'Université de Birmingham',
      Country: {
        connect: { id: countries.find((country) => country.code === 'GB').id },
      },
      codes: ['23BIRMINGHAM'],
      domains: ['@univ-birmingham.fr'],
      timezone: 'Europe/London',
      Parent: { connect: { id: UniversitySeedIDs.CENTRAL } },
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
      website: 'https://www.birmingham.ac.uk',
      pairing_mode: PairingMode.SEMI_AUTOMATIC,
      notification_email: 'notification+birm@test.fr',
      NativeLanguage: {
        connect: {
          id: languageCodes.find((language) => language.code === 'en').id,
        },
      },
    },
  });

  await prisma.organizations.create({
    data: {
      id: UniversitySeedIDs.FRANCFORT,
      name: 'Université de Francfort',
      Country: {
        connect: { id: countries.find((country) => country.code === 'DE').id },
      },
      codes: ['23FRANCFORT'],
      domains: ['@univ-francfort.fr'],
      timezone: 'Europe/Berlin',
      Parent: { connect: { id: UniversitySeedIDs.CENTRAL } },
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
      website: 'https://www.toto.de',
      pairing_mode: PairingMode.AUTOMATIC,
      NativeLanguage: {
        connect: {
          id: languageCodes.find((language) => language.code === 'de').id,
        },
      },
    },
  });

  await prisma.organizations.create({
    data: {
      id: UniversitySeedIDs.OTTAWA,
      name: 'Université de Ottawa',
      Country: {
        connect: { id: countries.find((country) => country.code === 'CA').id },
      },
      codes: ['23OTTAWA'],
      domains: ['@univ-ottawa.ca', '@thetribe.io'],
      timezone: 'Canada/Atlantic',
      Parent: { connect: { id: UniversitySeedIDs.CENTRAL } },
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
      website: 'https://www.toto.ca',
      pairing_mode: PairingMode.SEMI_AUTOMATIC,
      NativeLanguage: {
        connect: {
          id: languageCodes.find((language) => language.code === 'en').id,
        },
      },
    },
  });
};
