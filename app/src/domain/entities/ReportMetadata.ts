class ReportMetadata {
    constructor(
        public filePath: string,
        public mediaType: string,
        public tandemUserName: string,
        public tandemLanguage: string,
        public openGraphResult: any,
        public originalFilename: string
    ) {}
}

export default ReportMetadata;
