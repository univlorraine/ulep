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
