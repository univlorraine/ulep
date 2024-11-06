import Campus from './Campus';

class University {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly isCentral: boolean,
        public readonly timezone: string,
        public readonly sites: Campus[],
        public readonly hasCode: boolean,
        public readonly isCodeMandatory: boolean,
        public readonly admissionStart: Date,
        public readonly admissionEnd: Date,
        public readonly openServiceDate: Date,
        public readonly closeServiceDate: Date,
        public readonly maxTandemsPerUser: number,
        public readonly logo?: string
    ) {}
}

export default University;
