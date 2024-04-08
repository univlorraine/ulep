import University from '../entities/University';

interface GetPartnersToUniversityUsecaseInterface {
    execute(universityId: string): Promise<University[] | Error>;
}

export default GetPartnersToUniversityUsecaseInterface;
