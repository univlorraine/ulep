import Language from './Language';

class University {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly isCentral: boolean,
        public readonly languages: Language[],
        public readonly timezone: string,
        public readonly sites: string[]
    ) {}
}

export default University;
