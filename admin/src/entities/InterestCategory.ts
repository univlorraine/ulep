import Interest from './Interest';
import TextContent from './TextContent';

class InterestCategory {
    constructor(
        readonly id: string,
        readonly name: TextContent,
        readonly interests: Interest[]
    ) {}
}

export default InterestCategory;
