import { TextContent } from './translation.model';

export class InterestCategory {
  id: string;
  name: TextContent;
  interests?: Interest[];
}

export class Interest {
  id: string;
  name: TextContent;
}
