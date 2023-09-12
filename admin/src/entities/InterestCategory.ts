import Interest from './Interest';
import TextContent from './TextContent';

type InterestCategory = {
    id: string;
    name: TextContent;
    interests: Interest[];
};

export default InterestCategory;
