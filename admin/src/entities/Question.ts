import TextContent from './TextContent';

type Question = {
    id: string;
    answer: boolean;
    level: string;
    value: TextContent;
};

export default Question;
