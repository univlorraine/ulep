import { Activity } from '../../entities/Activity';
interface GetActivityUsecaseInterface {
    execute: (activityId: string) => Promise<Activity | Error>;
}

export default GetActivityUsecaseInterface;
