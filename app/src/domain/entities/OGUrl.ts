class OGImage {
    constructor(public readonly url: string, public readonly type: string) {}
}

export class OGUrl {
    constructor(
        public readonly ogSiteName?: string,
        public readonly ogUrl?: string,
        public readonly ogLocale?: string,
        public readonly ogImage?: OGImage[],
        public readonly ogTitle?: string,
        public readonly ogDescription?: string
    ) {}
}
