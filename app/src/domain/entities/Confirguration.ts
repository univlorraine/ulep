class Configuration {
    constructor(
        public readonly instanceName: string,
        public readonly mainUniversityName: string,
        public readonly emailContact: string,
        public readonly cguUrl: string,
        public readonly confidentialityUrl: string,
        public readonly ressourceUrl: string,
        public readonly primaryColor: string,
        public readonly primaryDarkColor: string,
        public readonly primaryBackgroundImageColor: string,
        public readonly secondaryColor: string,
        public readonly secondaryDarkColor: string,
        public readonly secondaryBackgroundImageColor: string,
    ) {}
}

export default Configuration;
