import { ActivityThemeCategoryWithoutThemes } from './ActivityThemeCategoryWithoutThemes';
import TextContent from './TextContent';
import Translation from './Translation';

export type ActivityTheme = {
    id: string;
    category?: ActivityThemeCategoryWithoutThemes;
    content: string;
    translations: Translation[];
};

export type ActivityThemeDetails = {
    id: string;
    content: TextContent;
};
