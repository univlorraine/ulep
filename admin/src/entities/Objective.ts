import TextContent from './TextContent';

class Objective {
    constructor(
        readonly id: string,
        readonly image: string,
        readonly name: TextContent
    ) {}
}

export default Objective;
