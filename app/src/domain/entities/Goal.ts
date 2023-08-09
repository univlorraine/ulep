class Goal {
    constructor(private readonly _id: string, private readonly _name: string, private readonly _image: string) {}

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get image(): string {
        return this._image;
    }
}

export default Goal;
