import MediaObject from './MediaObject';
import TextContent from './TextContent';

class Objective {
    constructor(
        readonly id: string,
        readonly image: MediaObject,
        readonly name: TextContent
    ) {}
}

export default Objective;
