import Translation from './Translation';

class IndexedTranslation {
    constructor(
        readonly index: number,
        readonly translation: Translation
    ) {}
}

export default IndexedTranslation;
