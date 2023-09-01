import University from './University';

class Country {
    constructor(
        public readonly id: string,
        public readonly code: string,
        public readonly name: string,
        public readonly emoji: string,
        public readonly universities: University[]
    ) {}
}

export default Country;
