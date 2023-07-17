class Language {
    constructor(private readonly _code: string, private readonly _name: string, private readonly _enalbed: boolean) {}

    get enabled(): boolean {
        return this._enalbed;
    }

    get code(): string {
        return this._code;
    }

    get name(): string {
        return this._name;
    }
}

export default Language;
