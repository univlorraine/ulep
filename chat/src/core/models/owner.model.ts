interface OwnerProps {
    id: string;
    name: string;
    image: string;
}

export class Owner {
    readonly id: string;
    readonly name: string;
    readonly image: string;

    constructor(props: OwnerProps) {
        this.id = props.id;
        this.name = props.name;
        this.image = props.image;
    }
}
