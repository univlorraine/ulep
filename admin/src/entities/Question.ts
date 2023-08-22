import TextContent from './TextContent';

class Question {
    constructor(
        readonly id: string,
        readonly answer: boolean,
        readonly level: string,
        readonly value: TextContent
    ) {}
}

export default Question;
