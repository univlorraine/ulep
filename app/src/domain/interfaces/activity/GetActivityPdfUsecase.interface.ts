import { Activity } from '../../entities/Activity';

interface GetActivityPdfUsecaseInterface {
    execute: (activity: Activity) => Promise<void | Error>;
}

export default GetActivityPdfUsecaseInterface;
