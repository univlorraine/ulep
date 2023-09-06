import Translation from './Translation';

type TextContent = {
    content: string;
    language: TranslatedLanguage;
    translations: Translation[];
};

export default TextContent;
