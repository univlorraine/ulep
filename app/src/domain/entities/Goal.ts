import MediaObject from "./MediaObject";

class Goal {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly image?: MediaObject
    ) {}
}

export default Goal;
