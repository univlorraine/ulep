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
    ['cy', '🇬🇧'], // Welsh - United Kingdom
    ['da', '🇩🇰'], // Danish - Denmark
    ['de', '🇩🇪'], // German - Germany
    ['dv', '🇲🇻'], // Divehi - Maldives
    ['dz', '🇧🇹'], // Dzongkha - Bhutan
    ['el', '🇬🇷'], // Greek - Greece
    ['en', '🇺🇸'], // English - United States
    ['eo', '🌐'], // Esperanto - No associated country
    ['es', '🇲🇽'], // Spanish - Mexico
    ['et', '🇪🇪'], // Estonian - Estonia
    ['eu', '🇪🇸'], // Basque - Spain
    ['fa', '🇮🇷'], // Persian - Iran
    ['fi', '🇫🇮'], // Finnish - Finland
    ['fj', '🇫🇯'], // Fijian - Fiji
    ['fo', '🇫🇴'], // Faroese - Faroe Islands
    ['fr', '🇫🇷'], // French - France
    ['fy', '🇳🇱'], // Western Frisian - Netherlands
    ['ga', '🇮🇪'], // Irish - Ireland
    ['gd', '🇬🇧'], // Scottish Gaelic - United Kingdom
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
    ['pt', '🇧🇷'], // Portuguese - Brazil
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

export const isPasswordCorrect = (password: string) => {
    const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    return regex.test(password);
};

export const isEmailCorrect = (email: string) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return regex.test(email);
};

export const isNameCorrect = (firstname: string) => {
    const regex = /^[a-zA-Zà-ÿÀ-Ý-]+$/;

    return regex.test(firstname);
};

export const codeCountryToFlag = (countryCode: string) => {
    const countriesMap = new Map(countriesCodeWithFlags);
    if (countriesMap.has(countryCode.toLocaleLowerCase())) {
        return countriesMap.get(countryCode.toLowerCase());
    }

    return '🌐';
};
