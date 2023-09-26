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
    admissionStart: Date;
    admissionEnd: Date;
    sites: Campus[];
    codes: string[];
    domains: string[];
    pairingMode: PairingMode;
    website: string;
    notificationEmail?: string;
};

export default University;
