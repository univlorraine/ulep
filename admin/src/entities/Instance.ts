export enum EditoMandatoryTranslations {
    CentralUniversityLanguage = 'CentralUniversityLanguage',
    PartnerUniversityLanguage = 'PartnerUniversityLanguage',
    English = 'English',
}

type Instance = {
    name: string;
    email: string;
    ressourceUrl: string;
    cguUrl: string;
    confidentialityUrl: string;
    primaryColor: string;
    primaryBackgroundColor: string;
    primaryDarkColor: string;
    secondaryColor: string;
    secondaryBackgroundColor: string;
    secondaryDarkColor: string;
    isInMaintenance: boolean;
    daysBeforeClosureNotification: number;
    editoMandatoryTranslations: EditoMandatoryTranslations[];
};

export interface InstanceFormPayload {
    name: string;
    email: string;
    ressourceUrl: string;
    cguUrl: string;
    confidentialityUrl: string;
    primaryColor: string;
    primaryBackgroundColor: string;
    primaryDarkColor: string;
    secondaryColor: string;
    secondaryBackgroundColor: string;
    secondaryDarkColor: string;
    isInMaintenance: boolean;
    daysBeforeClosureNotification: number;
    defaultCertificateFile: File | undefined;
    editoMandatoryTranslations: EditoMandatoryTranslations[];
}

export default Instance;
