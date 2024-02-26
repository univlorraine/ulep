import Campus from './Campus';
import Country from './Country';

export enum PairingMode {
    MANUAL = 'MANUAL',
    SEMI_AUTOMATIC = 'SEMI_AUTOMATIC',
    AUTOMATIC = 'AUTOMATIC',
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
    website: string;
    notificationEmail?: string;
};

export default University;

export const isCentralUniversity = (university: University): boolean => !university.parent;
