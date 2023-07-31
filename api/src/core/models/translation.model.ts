export class TextContent {
  id: string;
  content: string;
  language: string;
  translations?: Translation[] = [];
}

export class Translation {
  content: string;
  language: string;
}
