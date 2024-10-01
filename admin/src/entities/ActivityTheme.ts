import TextContent from './TextContent';
import Translation from './Translation';

export type ActivityTheme = {
    id: string;
    content: string;
    translations: Translation[];
};

export type ActivityThemeDetails = {
    id: string;
    content: TextContent;
};
