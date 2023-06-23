import { UpdateUniversityUsecase } from '../../../src/core/usecases/universities/update-university.usecase';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { UniversityDoesNotExist } from '../../../src/core/errors/RessourceDoesNotExist';
import { ConflictException } from '@nestjs/common';
import { University } from '../../../src/core/models/university';
import { Country } from '../../../src/core/models/country';

describe('UpdateUniversity', () => {
  const universityRepository = new InMemoryUniversityRepository();
  const updateUniversityUsecase = new UpdateUniversityUsecase(
    universityRepository,
  );

  const universities = [
    new University({
      id: 'uuid-1',
      name: 'Université de Lorraine',
      timezone: 'Europe/Paris',
      country: new Country({ id: 'uuid', code: 'FR', name: 'France' }),
      admissionStart: new Date('2000-01-01'),
      admissionEnd: new Date('2000-12-31'),
    }),
    new University({
      id: 'uuid-2',
      name: 'Université de Paris',
      timezone: 'Europe/Paris',
      country: new Country({ id: 'uuid', code: 'FR', name: 'France' }),
      admissionStart: new Date('2000-01-01'),
      admissionEnd: new Date('2000-12-31'),
    }),
  ];

  beforeEach(() => {
    universityRepository.reset();
  });

  it('should update the university', async () => {
    universityRepository.init(universities);

    const university = await updateUniversityUsecase.execute({
      id: 'uuid-1',
      name: 'Université de Grenoble',
      admissionStart: new Date('2023-01-01'),
      admissionEnd: new Date('2023-12-31'),
    });

    expect(university).toBeDefined();
    expect(university.id).toBe('uuid-1');
    expect(university.name).toBe('Université de Grenoble');
    expect(university.admissionStart).toEqual(new Date('2023-01-01'));
    expect(university.admissionEnd).toEqual(new Date('2023-12-31'));
  });

  it('should throw an error if the university does not exists', async () => {
    universityRepository.init(universities);

    try {
      await updateUniversityUsecase.execute({
        id: 'uuid-3',
        name: 'Université de Grenoble',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UniversityDoesNotExist);
    }
  });

  it('should throw an error if the university name already exist', async () => {
    universityRepository.init(universities);

    try {
      await updateUniversityUsecase.execute({
        id: 'uuid-2',
        name: 'Université de Lorraine',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
    }
  });
});
