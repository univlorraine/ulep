const getLocaleCode = (locale: string) => {
    if (locale === 'fr') {
        return 'fr-FR';
    }

    return 'en-US';
};

export default getLocaleCode;
