export class Interest {
    constructor(public readonly id: string, public readonly name: string) {}
}

class CategoryInterests {
    constructor(public readonly id: string, public readonly name: string, public readonly interests: Interest[]) {}
}

export default CategoryInterests;
