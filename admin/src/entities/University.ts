import Campus from './Campus';
import Country from './Country';
import Language from './Language';

export enum PairingMode {
    MANUAL = 'MANUAL',
    SEMI_AUTOMATIC = 'SEMI_AUTOMATIC',
    AUTOMATIC = 'AUTOMATIC',
}

export enum Status {
    CLOSED = 'CLOSED',
    OPEN = 'OPEN',
    SOON = 'SOON',
}

type University = {
    id: string;
    name: string;
    parent: string;
    country: Country;
    timezone: string;
    admissionStart: string;
    admissionEnd: string;
    openServiceDate: string;
    closeServiceDate: string;
    sites: Campus[];
    codes: string[];
    domains: string[];
    pairingMode: PairingMode;
    maxTandemsPerUser: number;
    nativeLanguage: Language;
    website: string;
    notificationEmail?: string;
    specificLanguagesAvailable?: Language[];
};

export default University;

export const isCentralUniversity = (university: University): boolean => !university.parent;
