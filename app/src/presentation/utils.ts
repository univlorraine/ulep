import LearningLanguage from '../domain/entities/LearningLanguage';
import TestedLanguage from '../domain/entities/TestedLanguage';

export const CEFR_LEVELS: CEFR[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const countriesCodeWithFlags: [string, string][] = [
    ['aa', '🇪🇹'], // Afar - Ethiopia
    ['ab', '🇬🇪'], // Abkhaz - Georgia
    ['af', '🇿🇦'], // Afrikaans - South Africa
    ['am', '🇪🇹'], // Amharic - Ethiopia
    ['ar', '🇪🇬'], // Arabic - Egypt
    ['as', '🇮🇳'], // Assamese - India
    ['ay', '🇧🇴'], // Aymara - Bolivia
    ['az', '🇦🇿'], // Azerbaijani - Azerbaijan
    ['be', '🇧🇾'], // Belarusian - Belarus
    ['bg', '🇧🇬'], // Bulgarian - Bulgaria
    ['bi', '🇻🇺'], // Bislama - Vanuatu
    ['bn', '🇧🇩'], // Bengali - Bangladesh
    ['bo', '🇨🇳'], // Tibetan - China
    ['br', '🇫🇷'], // Breton - France
    ['bs', '🇧🇦'], // Bosnian - Bosnia and Herzegovina
    ['ca', '🇪🇸'], // Catalan - Spain
    ['co', '🇫🇷'], // Corsican - France
    ['cs', '🇨🇿'], // Czech - Czechia
    ['cy', '🏴󠁧󠁢󠁷󠁬󠁳󠁿'], // Welsh - Wales
    ['da', '🇩🇰'], // Danish - Denmark
    ['de', '🇩🇪'], // German - Germany
    ['dv', '🇲🇻'], // Divehi - Maldives
    ['dz', '🇧🇹'], // Dzongkha - Bhutan
    ['el', '🇬🇷'], // Greek - Greece
    ['en', '🇬🇧'], // English - United Kingdom
    ['eo', '🌐'], // Esperanto - No associated country
    ['es', '🇪🇸'], // Spanish - Spain
    ['et', '🇪🇪'], // Estonian - Estonia
    ['eu', '🇪🇸'], // Basque - Spain
    ['fa', '🇮🇷'], // Persian - Iran
    ['fi', '🇫🇮'], // Finnish - Finland
    ['fj', '🇫🇯'], // Fijian - Fiji
    ['fo', '🇫🇴'], // Faroese - Faroe Islands
    ['fr', '🇫🇷'], // French - France
    ['fy', '🇳🇱'], // Western Frisian - Netherlands
    ['ga', '🇮🇪'], // Irish - Ireland
    ['gd', '🏴󠁧󠁢󠁳󠁣󠁴󠁿'], // Scottish Gaelic - United Kingdom
    ['gl', '🇪🇸'], // Galician - Spain
    ['gn', '🇵🇾'], // Guarani - Paraguay
    ['gu', '🇮🇳'], // Gujarati - India
    ['ha', '🇳🇬'], // Hausa - Nigeria
    ['he', '🇮🇱'], // Hebrew - Israel
    ['hi', '🇮🇳'], // Hindi - India
    ['hr', '🇭🇷'], // Croatian - Croatia
    ['hu', '🇭🇺'], // Hungarian - Hungary
    ['hy', '🇦🇲'], // Armenian - Armenia
    ['ia', '🌐'], // Interlingua - No associated country
    ['id', '🇮🇩'], // Indonesian - Indonesia
    ['ie', '🌐'], // Interlingue - No associated country
    ['ik', '🇺🇸'], // Inupiaq - United States (Alaska)
    ['is', '🇮🇸'], // Icelandic - Iceland
    ['it', '🇮🇹'], // Italian - Italy
    ['iu', '🇨🇦'], // Inuktitut - Canada
    ['ja', '🇯🇵'], // Japanese - Japan
    ['jv', '🇮🇩'], // Javanese - Indonesia
    ['ka', '🇬🇪'], // Georgian - Georgia
    ['kk', '🇰🇿'], // Kazakh - Kazakhstan
    ['kl', '🇬🇱'], // Kalaallisut - Greenland
    ['km', '🇰🇭'], // Khmer - Cambodia
    ['kn', '🇮🇳'], // Kannada - India
    ['ko', '🇰🇷'], // Korean - South Korea
    ['ks', '🇮🇳'], // Kashmiri - India
    ['ku', '🇹🇷'], // Kurdish - Turkey
    ['ky', '🇰🇬'], // Kyrgyz - Kyrgyzstan
    ['la', '🇻🇦'], // Latin - Vatican City
    ['lb', '🇱🇺'], // Luxembourgish - Luxembourg
    ['ln', '🇨🇩'], // Lingala - Democratic Republic of the Congo
    ['lo', '🇱🇦'], // Lao - Laos
    ['lt', '🇱🇹'], // Lithuanian - Lithuania
    ['lv', '🇱🇻'], // Latvian - Latvia
    ['mg', '🇲🇬'], // Malagasy - Madagascar
    ['mi', '🇳🇿'], // Māori - New Zealand
    ['mk', '🇲🇰'], // Macedonian - North Macedonia
    ['ml', '🇮🇳'], // Malayalam - India
    ['mn', '🇲🇳'], // Mongolian - Mongolia
    ['mr', '🇮🇳'], // Marathi - India
    ['ms', '🇲🇾'], // Malay - Malaysia
    ['mt', '🇲🇹'], // Maltese - Malta
    ['my', '🇲🇲'], // Burmese - Myanmar
    ['na', '🇳🇷'], // Nauru - Nauru
    ['ne', '🇳🇵'], // Nepali - Nepal
    ['nl', '🇳🇱'], // Dutch - Netherlands
    ['no', '🇳🇴'], // Norwegian - Norway
    ['oc', '🇫🇷'], // Occitan - France
    ['om', '🇪🇹'], // Oromo - Ethiopia
    ['or', '🇮🇳'], // Odia - India
    ['pa', '🇮🇳'], // Punjabi - India
    ['pl', '🇵🇱'], // Polish - Poland
    ['ps', '🇦🇫'], // Pashto - Afghanistan
    ['pt', '🇵🇹'], // Portuguese - Portugal
    ['qu', '🇵🇪'], // Quechua - Peru
    ['rm', '🇨🇭'], // Romansh - Switzerland
    ['rn', '🇧🇮'], // Rundi - Burundi
    ['ro', '🇷🇴'], // Romanian - Romania
    ['ru', '🇷🇺'], // Russian - Russia
    ['rw', '🇷🇼'], // Kinyarwanda - Rwanda
    ['sa', '🇮🇳'], // Sanskrit - India
    ['sd', '🇵🇰'], // Sindhi - Pakistan
    ['sg', '🇨🇫'], // Sango - Central African Republic
    ['si', '🇱🇰'], // Sinhala - Sri Lanka
    ['sk', '🇸🇰'], // Slovak - Slovakia
    ['sl', '🇸🇮'], // Slovene - Slovenia
    ['sm', '🇼🇸'], // Samoan - Samoa
    ['sn', '🇿🇼'], // Shona - Zimbabwe
    ['so', '🇸🇴'], // Somali - Somalia
    ['sq', '🇦🇱'], // Albanian - Albania
    ['sr', '🇷🇸'], // Serbian - Serbia
    ['ss', '🇸🇿'], // Swati - Eswatini
    ['st', '🇱🇸'], // Southern Sotho - Lesotho
    ['su', '🇮🇩'], // Sundanese - Indonesia
    ['sv', '🇸🇪'], // Swedish - Sweden
    ['sw', '🇹🇿'], // Swahili - Tanzania
    ['ta', '🇮🇳'], // Tamil - India
    ['te', '🇮🇳'], // Telugu - India
    ['tg', '🇹🇯'], // Tajik - Tajikistan
    ['th', '🇹🇭'], // Thai - Thailand
    ['ti', '🇪🇹'], // Tigrinya - Ethiopia
    ['tk', '🇹🇲'], // Turkmen - Turkmenistan
    ['tl', '🇵🇭'], // Tagalog - Philippines
    ['tn', '🇧🇼'], // Tswana - Botswana
    ['to', '🇹🇴'], // Tongan - Tonga
    ['tr', '🇹🇷'], // Turkish - Turkey
    ['ts', '🇿🇦'], // Tsonga - South Africa
    ['tt', '🇷🇺'], // Tatar - Russia
    ['tw', '🇬🇭'], // Twi - Ghana
    ['ty', '🇵🇫'], // Tahitian - French Polynesia
    ['ug', '🇨🇳'], // Uyghur - China
    ['uk', '🇺🇦'], // Ukrainian - Ukraine
    ['ur', '🇵🇰'], // Urdu - Pakistan
    ['uz', '🇺🇿'], // Uzbek - Uzbekistan
    ['ve', '🇿🇦'], // Venda - South Africa
    ['vi', '🇻🇳'], // Vietnamese - Vietnam
    ['vo', '🌐'], // Volapük - No associated country
    ['wa', '🇧🇪'], // Walloon - Belgium
    ['wo', '🇸🇳'], // Wolof - Senegal
    ['xh', '🇿🇦'], // Xhosa - South Africa
    ['yi', '🇮🇱'], // Yiddish - Israel
    ['yo', '🇳🇬'], // Yoruba - Nigeria
    ['za', '🇨🇳'], // Zhuang - China
    ['zh', '🇨🇳'], // Chinese - China
    ['zu', '🇿🇦'], // Zulu - South Africa
];

export const HYBRID_MAX_WIDTH = 768;

export const BACKGROUND_HYBRID_STYLE_INLINE = {
    backgroundPosition: '-100px top', // Negative position for "outside box" effect
    backgroundRepeat: 'no-repeat',
    backgroundSize: '150%', // Increase size on mobile for "outside box" effect
};

export const BACKGROUND_WEB_STYLE_INLINE = {
    backgroundPosition: 'right top',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
};

export const isEmailCorrect = (email: string) => {
    const regex = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/;

    return regex.test(email);
};

export const isNameCorrect = (firstname: string) => {
    const regex = /^^\D+$/;

    return regex.test(firstname);
};

export const codeLanguageToFlag = (countryCode: string) => {
    const countriesMap = new Map(countriesCodeWithFlags);
    if (countriesMap.has(countryCode.toLocaleLowerCase())) {
        return countriesMap.get(countryCode.toLowerCase());
    }

    return '🌐';
};

export const getPreviousLevel = (level: CEFR) => {
    switch (level) {
        case 'A1':
            return 'A0';
        case 'A2':
            return 'A1';
        case 'B1':
            return 'A2';
        case 'B2':
            return 'B1';
        case 'C1':
            return 'B2';
        case 'C2':
            return 'C1';
        default:
            return 'A0';
    }
};

export const getNextLevel = (level: CEFR) => {
    switch (level) {
        case 'A0':
            return 'A1';
        case 'A1':
            return 'A2';
        case 'A2':
            return 'B1';
        case 'B1':
            return 'B2';
        case 'B2':
            return 'C1';
        case 'C1':
            return 'C2';
        default:
            return 'A0';
    }
};

export const isDomainValid = (email: string, domains: string[]) => {
    return domains.some((domain) => email.includes(domain));
};

export const isCodeValid = (code: string, codesToCheck: string[]) => {
    return codesToCheck.some((codeToCheck) => codeToCheck === code);
};

export const learningLanguagesToTestedLanguages = (
    learningLanguages: LearningLanguage[],
    testedLanguages: TestedLanguage[],
    specificLanguage?: string
) => {
    const convertedLearningLanguages = learningLanguages.map(
        (learningLanguage) => new TestedLanguage(learningLanguage.code, learningLanguage.name, learningLanguage.level)
    );

    testedLanguages.map((testedLanguage) => {
        if (!convertedLearningLanguages.find((learningLanguage) => learningLanguage.code === testedLanguage.code)) {
            convertedLearningLanguages.push(testedLanguage);
        }
    });

    if (specificLanguage) {
        return convertedLearningLanguages.filter((language) => language.code === specificLanguage);
    }

    return convertedLearningLanguages;
};

export const compareArrays = (a: unknown[], b: unknown[]) => JSON.stringify(a) == JSON.stringify(b);

export const compareCEFR = (levelA: CEFR, levelB: CEFR) => {
    const CEFRlevels: { [key: string]: number } = {
        A0: 0,
        A1: 1,
        A2: 2,
        B1: 3,
        B2: 4,
        C1: 5,
        C2: 6,
    };

    return CEFRlevels[levelB] - CEFRlevels[levelA];
};

