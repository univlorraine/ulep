import { ActivityStatus } from '../../entities/Activity';

interface UpdateActivityStatusUsecaseInterface {
    execute: (id: string, status: ActivityStatus) => Promise<void | Error>;
}

export default UpdateActivityStatusUsecaseInterface;
