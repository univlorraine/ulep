import Country from '../../entities/Country';
import Language from '../../entities/Language';

const universityToFormData = (
    name: string,
    country: Country,
    timezone: string,
    admissionStart: Date,
    admissionEnd: Date,
    openServiceDate: Date,
    closeServiceDate: Date,
    codes: string[],
    domains: string[],
    pairingMode: string,
    maxTandemsPerUser: number,
    nativeLanguage: Language,
    website?: string,
    notificationEmail?: string,
    specificLanguagesAvailable?: Language[],
    file?: File
) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('countryId', country.id);
    formData.append('timezone', timezone);
    formData.append('admissionStart', admissionStart.toISOString());
    formData.append('admissionEnd', admissionEnd.toISOString());
    formData.append('openServiceDate', openServiceDate.toISOString());
    formData.append('closeServiceDate', closeServiceDate.toISOString());
    codes.forEach((code, index) => {
        formData.append(`codes[${index}]`, code);
    });
    domains.forEach((domain, index) => {
        formData.append(`domains[${index}]`, domain);
    });
    formData.append('pairingMode', pairingMode);
    formData.append('maxTandemsPerUser', maxTandemsPerUser.toString());
    formData.append('nativeLanguageId', nativeLanguage.id);

    if (website) formData.append('website', website);
    if (specificLanguagesAvailable) {
        specificLanguagesAvailable.forEach((language, index) => {
            formData.append(`specificLanguagesAvailable[${index}]`, language.id);
        });
    }
    if (notificationEmail) formData.append('notificationEmail', notificationEmail);
    if (file) formData.append('file', file);

    return formData;
};

export default universityToFormData;
