class University {
    constructor(private readonly _id: string, private readonly _name: string, private readonly _isCentral: boolean) {}

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get isCentral(): boolean {
        return this._isCentral;
    }
}

export default University;
