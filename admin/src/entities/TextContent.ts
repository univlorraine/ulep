import Translation from './Translation';

class TextContent {
    constructor(
        public content: string,
        public language: TranslatedLanguage,
        public translations: Translation[]
    ) {}
}

export default TextContent;
