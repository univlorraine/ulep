import { Collection } from '../../../src/shared/types/collection';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import seedDefinedNumberOfUniversities from '../../seeders/universities';
import { University } from '../../../src/core/models/university';
import { GetUniversitiesUsecase } from '../../../src/core/usecases/universities/get-universities.usecase';

describe('GetUniversities', () => {
  const universityRepository = new InMemoryUniversityRepository();
  const getUniversitiesUsecase = new GetUniversitiesUsecase(
    universityRepository,
  );

  beforeEach(() => {
    universityRepository.reset();
  });

  it('should return x items of n page', async () => {
    const ITEMS_PER_PAGE = 30;
    const ITEMS_COUNT = 100;
    const NB_PAGES = Math.floor(ITEMS_COUNT / ITEMS_PER_PAGE);
    const REST = 100 % ITEMS_PER_PAGE;

    universityRepository.init(seedDefinedNumberOfUniversities(ITEMS_COUNT));

    const result: Collection<University>[] = [];

    for (let i = 1; i <= NB_PAGES; i++) {
      const command = { page: i, limit: ITEMS_PER_PAGE };

      const universities = await getUniversitiesUsecase.execute(command);

      result.push(universities);
    }

    result.forEach((university, index) => {
      expect(university.items.length).toEqual(
        index === NB_PAGES ? REST : ITEMS_PER_PAGE,
      );
      expect(university.totalItems).toEqual(ITEMS_COUNT);
    });
  });
});
