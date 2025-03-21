import * as Prisma from '@prisma/client';
import { MediaObject } from 'src/core/models';
import {
  EditoMandatoryTranslations,
  Instance,
} from 'src/core/models/Instance.model';
import { languageMapper } from './language.mapper';

export type InstanceSnapshot = Prisma.Instance & {
  DefaultCertificateFile: Prisma.MediaObjects;
  EditoCentralUniversityTranslations: Prisma.LanguageCodes[];
};

export const instanceMapper = (instanceSnapshot: InstanceSnapshot) => {
  return new Instance({
    id: instanceSnapshot.id,
    name: instanceSnapshot.name,
    email: instanceSnapshot.email,
    ressourceUrl: instanceSnapshot.ressource_url,
    cguUrl: instanceSnapshot.cgu_url,
    confidentialityUrl: instanceSnapshot.confidentiality_url,
    primaryColor: instanceSnapshot.primary_color,
    primaryBackgroundColor: instanceSnapshot.primary_background_color,
    primaryDarkColor: instanceSnapshot.primary_dark_color,
    secondaryColor: instanceSnapshot.secondary_color,
    secondaryBackgroundColor: instanceSnapshot.secondary_background_color,
    secondaryDarkColor: instanceSnapshot.secondary_dark_color,
    isInMaintenance: instanceSnapshot.is_in_maintenance,
    daysBeforeClosureNotification:
      instanceSnapshot.days_before_closure_notification,
    defaultCertificateFile:
      instanceSnapshot.DefaultCertificateFile &&
      new MediaObject({
        id: instanceSnapshot.DefaultCertificateFile.id,
        name: instanceSnapshot.DefaultCertificateFile.name,
        bucket: instanceSnapshot.DefaultCertificateFile.bucket,
        mimetype: instanceSnapshot.DefaultCertificateFile.mime,
        size: instanceSnapshot.DefaultCertificateFile.size,
      }),
    editoMandatoryTranslations:
      instanceSnapshot.edito_mandatory_translations.map(
        (translation) => translation as EditoMandatoryTranslations,
      ),
    editoCentralUniversityTranslations:
      instanceSnapshot.EditoCentralUniversityTranslations &&
      instanceSnapshot.EditoCentralUniversityTranslations.map((translation) =>
        languageMapper(translation),
      ),
  });
};
