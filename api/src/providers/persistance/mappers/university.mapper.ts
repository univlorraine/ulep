import * as Prisma from '@prisma/client';
import { MediaObject, PairingMode, University } from 'src/core/models';
import { campusMapper } from './campus.mapper';
import { countryMapper } from 'src/providers/persistance/mappers/country.mapper';
import { languageMapper } from 'src/providers/persistance/mappers/language.mapper';

export const UniversityRelations = {
  Country: true,
  Image: true,
  Places: true,
  SpecificLanguagesAvailable: true,
  NativeLanguage: true,
};

export type UniversitySnapshot = Prisma.Organizations & {
  Country: Prisma.CountryCodes;
  Image: Prisma.MediaObjects;
  Places: Prisma.Places[];
  SpecificLanguagesAvailable: Prisma.LanguageCodes[];
  NativeLanguage: Prisma.LanguageCodes;
};

export const universityMapper = (snapshot: UniversitySnapshot): University => {
  return new University({
    id: snapshot.id,
    name: snapshot.name,
    country: countryMapper(snapshot.Country),
    parent: snapshot.parent_id,
    campus: snapshot.Places.map((place) => campusMapper(place)),
    codes: snapshot.codes,
    domains: snapshot.domains,
    timezone: snapshot.timezone,
    admissionStart: snapshot.admissionStartDate,
    admissionEnd: snapshot.admissionEndDate,
    openServiceDate: snapshot.openServiceDate,
    closeServiceDate: snapshot.closeServiceDate,
    website: snapshot.website,
    pairingMode: PairingMode[snapshot.pairing_mode],
    maxTandemsPerUser: snapshot.max_tandems_per_user,
    notificationEmail: snapshot.notification_email,
    defaultContactId: snapshot.default_contact_id,
    specificLanguagesAvailable: snapshot.SpecificLanguagesAvailable.map(
      (language) => languageMapper(language),
    ),
    nativeLanguage: languageMapper(snapshot.NativeLanguage),
    logo:
      snapshot.Image &&
      new MediaObject({
        id: snapshot.Image.id,
        name: snapshot.Image.name,
        bucket: snapshot.Image.bucket,
        mimetype: snapshot.Image.mime,
        size: snapshot.Image.size,
      }),
  });
};
