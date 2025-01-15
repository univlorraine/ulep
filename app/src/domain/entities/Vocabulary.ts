class Vocabulary {
    constructor(
        public readonly id: string,
        public readonly word: string,
        public readonly translation: string,
        public readonly pronunciationWordUrl: string,
        public readonly pronunciationTranslationUrl: string
    ) {}
}

export default Vocabulary;
