import { ActivityTheme } from './ActivityTheme';
import TextContent from './TextContent';

export type ActivityThemeCategory = {
    id: string;
    content: string;
    themes: ActivityTheme[];
};

export type ActivityThemeCategoryDetails = {
    id: string;
    content: TextContent;
};
