class University {
    constructor(
        private readonly _id: string,
        private readonly _name: string,
        private readonly _isCentral: boolean,
        private readonly _languageCodes: string[],
        private readonly _timezone: string,
        private readonly _sites: string[]
    ) {}

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get isCentral(): boolean {
        return this._isCentral;
    }

    get languageCodes(): string[] {
        return this._languageCodes;
    }

    get sites(): string[] {
        return this._sites;
    }

    get timezone(): string {
        return this._timezone;
    }
}

export interface UniversityJsonInterface {
    _id: string;
    _name: string;
    _isCentral: boolean;
    _languageCodes: string[];
    _sites: string[];
    _timezone: string;
}

export const UniversityJsonToDomain = (universityJson: UniversityJsonInterface) => {
    return new University(
        universityJson._id,
        universityJson._name,
        universityJson._isCentral,
        universityJson._languageCodes,
        universityJson._timezone,
        universityJson._sites
    );
};

export default University;
