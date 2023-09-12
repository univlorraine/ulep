import Campus from './Campus';
import Country from './Country';

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
    website: string;
};

export default University;
