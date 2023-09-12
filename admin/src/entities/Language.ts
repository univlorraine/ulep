type Language = {
    id: string;
    code: string;
    name?: string;
    mainUniversityStatus: LanguageStatus;
    secondaryUniversityActive: boolean;
};

export default Language;
