import { ActivityThemeCategory } from '../../entities/Activity';
interface GetActivityThemesUsecaseInterface {
    execute: () => Promise<ActivityThemeCategory[] | Error>;
}

export default GetActivityThemesUsecaseInterface;
