type Language = {
    id: string;
    code: string;
    name?: string;
    mainUniversityStatus: LanguageStatus;
    secondaryUniversityActive: boolean;
    isDiscovery: boolean;
};

export default Language;
