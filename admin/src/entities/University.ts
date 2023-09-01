import Country from './Country';

interface University {
    id: string;
    name: string;
    parent: string;
    country: Country;
    timezone: string;
    admissionStart: Date;
    admissionEnd: Date;
    sites: { id: string; name: string }[];
    codes: string[];
    domains: string[];
    website: string;
}

export default University;
