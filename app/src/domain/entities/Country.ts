class Country {
    constructor(private readonly _id: string, private readonly _code: string, private readonly _name: string) {}

    get id(): string {
        return this._id;
    }

    get code(): string {
        return this._code;
    }

    get name(): string {
        return this._name;
    }
}

export default Country;
