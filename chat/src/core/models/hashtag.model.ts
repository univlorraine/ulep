interface HashtagProps {
    name: string;
    numberOfUses: number;
}

export class Hashtag {
    readonly name: string;
    readonly numberOfUses: number;

    constructor(props: HashtagProps) {
        this.name = props.name;
        this.numberOfUses = props.numberOfUses;
    }
}
