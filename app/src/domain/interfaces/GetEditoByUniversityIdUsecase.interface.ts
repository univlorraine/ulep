import Edito from '../entities/Edito';

interface GetEditoByUniversityIdUsecase {
    execute(universityId: string): Promise<Edito | Error>;
}

export default GetEditoByUniversityIdUsecase;
