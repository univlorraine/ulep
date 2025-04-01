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

import { Interest, Language, LearningObjective } from 'src/core/models';
import { UserPersonalData } from 'src/core/usecases/user/get-user-personal-data.usecase';
import { formatUserPersonalData } from './format-user-personal-data';
import { stringify } from 'csv-stringify';

interface UserPersonalDataToCsvParams {
  userData: UserPersonalData;
  avatarSignedUrl?: string;
}

export const userPersonalDataToCsv = (
  { userData, avatarSignedUrl }: UserPersonalDataToCsvParams,
  translate: (key: string, opts?: { ns: string }) => string,
) => {
  const content = formatUserPersonalData({
    ...userData,
    avatarSignedUrl,
  });

  const userLanguage = userData.profile.nativeLanguage.code;
  const dateFormater = new Intl.DateTimeFormat(userLanguage, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  const csv = stringify(content, {
    header: true,
    cast: {
      boolean: (value) =>
        translate(`export.values.${value ? 'true' : 'false'}`),
      date: (value) => dateFormater.format(value),
      string: (value, { header, column }) => {
        if (header) {
          return translate(`export.headers.${value}`);
        } else {
          let key: string;
          switch (column) {
            case 'gender':
            case 'role':
            case 'status':
            case 'meeting_frequency':
              key = column;
              break;
            case 'learning_request_type':
              key = 'learningType';
              break;
            case 'monday_availabilities':
            case 'tuesday_availabilities':
            case 'wednesday_availabilities':
            case 'thursday_availabilities':
            case 'friday_availabilities':
            case 'saturday_availabilities':
            case 'sunday_availabilities':
              key = 'availabilities';
              break;
          }
          if (key) {
            return translate(`export.values.${key}.${value}`);
          } else {
            return value;
          }
        }
      },
      object: (value, { column }) => {
        if (column === 'interests' || column === 'goals') {
          return JSON.stringify(
            value.map((item: Interest | LearningObjective) => {
              return (
                item.name.translations.find((translation) =>
                  translation.language.includes(userLanguage),
                )?.content || item.name.content
              );
            }),
          );
        } else if (
          column === 'native_language' ||
          column === 'learning_request_language'
        ) {
          return translate(`languages_code.${value.code}`, {
            ns: 'translation',
          });
        } else if (column === 'mastered_languages') {
          return JSON.stringify(
            value.map((item: Language) =>
              translate(`languages_code.${item.code}`, { ns: 'translation' }),
            ),
          );
        } else if (column === 'suggested_languages') {
          return JSON.stringify(
            value.map((item) => ({
              [translate('export.headers.arrayKeys.language')]: translate(
                `languages_code.${item.code}`,
                { ns: 'translation' },
              ),
              [translate('export.headers.arrayKeys.suggestion_date')]:
                dateFormater.format(item.suggestion_date),
            })),
          );
        } else if (column === 'historized_tandems') {
          return JSON.stringify(
            value.map((item) => ({
              [translate('export.headers.arrayKeys.language')]: translate(
                `languages_code.${item.code}`,
                { ns: 'translation' },
              ),
              [translate('export.headers.arrayKeys.historization_date')]:
                dateFormater.format(item.historization_date),
            })),
          );
        }
        return JSON.stringify(value);
      },
    },
  });

  return csv;
};
