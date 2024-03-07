import {
  CountryCode,
  Interest,
  Language,
  LearningObjective,
} from 'src/core/models';
import { UserPersonalData } from 'src/core/usecases/user/get-user-personal-data.usecase';
import { formatUserPersonalData } from './format-user-personal-data';
import { stringify } from 'csv-stringify';

interface UserPersonalDataToCsvParams {
  userData: UserPersonalData;
  avatarSignedUrl?: string;
  countries: CountryCode[];
}

export const userPersonalDataToCsv = (
  { userData, avatarSignedUrl, countries }: UserPersonalDataToCsvParams,
  translate: (key: string) => string,
) => {
  const countryNamesByCode = countries.reduce<{
    [key: string]: string;
  }>((acc, country) => {
    acc[country.code] = country.name;
    return acc;
  }, {});

  const content = formatUserPersonalData({
    ...userData,
    avatarSignedUrl,
  });

  const userLanguage = userData.profile.nativeLanguage.code;
  const csv = stringify(content, {
    header: true,
    cast: {
      boolean: (value) =>
        translate(`api.export.values.${value ? 'true' : 'false'}`),
      date: (value) => new Intl.DateTimeFormat(userLanguage).format(value),
      string: (value, { header, column }) => {
        if (header) {
          return translate(`api.export.headers.${value}`);
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
            case 'country':
              return countryNamesByCode[value] || value;
          }
          if (key) {
            return translate(`api.export.values.${key}.${value}`);
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
          return translate(`translation.languages_code.${value.code}`);
        } else if (column === 'mastered_languages') {
          return JSON.stringify(
            value.map((item: Language) =>
              translate(`translation.languages_code.${item.code}`),
            ),
          );
        }
        return JSON.stringify(value);
      },
    },
  });

  return csv;
};
