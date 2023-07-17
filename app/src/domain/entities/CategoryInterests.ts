class CategoryInterests {
    constructor(private readonly _id: string, private readonly _name: string, private readonly _interests: string[]) {}

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get interests(): string[] {
        return this._interests;
    }
}

export default CategoryInterests;
