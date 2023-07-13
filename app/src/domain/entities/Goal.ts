class Goal {
    constructor(private readonly _id: string, private readonly _image: string, private readonly _description: string) {}

    get id(): string {
        return this._id;
    }

    get description(): string {
        return this._description;
    }

    get image(): string {
        return this._image;
    }
}

export default Goal;
