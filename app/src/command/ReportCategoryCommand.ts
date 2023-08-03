import ReportCategory from '../domain/entities/ReportCategory';

interface ReportCategoryCommand {
    id: string;
    name: string;
}

export const reportCategoriesCommandToDomain = (command: ReportCategoryCommand[]) => {
    return command.map((reportCategory) => new ReportCategory(reportCategory.id, reportCategory.name));
};

export default ReportCategoryCommand;
