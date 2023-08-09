import { UserFactory } from '@app/common';
import { faker } from '@faker-js/faker';
import {
  Language,
  LearningType,
  ProficiencyLevel,
  Profile,
  Tandem,
  TandemStatus,
} from 'src/core/models';
import { GenerateTandemsUsecase } from 'src/core/usecases';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryProfileRepository } from 'src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryTandemRepository } from 'src/providers/persistance/repositories/in-memory-tandem-repository';
import { UuidProvider } from 'src/providers/services/uuid.provider';

const checkTandemArrayContainsTandemWithProfiles = (
  tandems: Tandem[],
  couple: {
    a: Profile;
    b: Profile;
  },
) =>
  tandems.some((tandem) => {
    const tandemProfileIds = tandem.profiles.map((profile) => profile.id);
    return (
      tandemProfileIds.includes(couple.a.id) &&
      tandemProfileIds.includes(couple.b.id)
    );
  });

describe('GenerateTandem UC', () => {
  const languageRepository = new InMemoryLanguageRepository();
  const userFactory = new UserFactory();
  const french = new Language({
    id: faker.string.uuid(),
    code: 'fr',
    name: 'french',
  });
  const english = new Language({
    id: faker.string.uuid(),
    code: 'en',
    name: 'english',
  });
  const spanish = new Language({
    id: faker.string.uuid(),
    code: 'es',
    name: 'spanish',
  });
  const deutch = new Language({
    id: faker.string.uuid(),
    code: 'de',
    name: 'deutch',
  });
  const profilesRepository = new InMemoryProfileRepository();
  beforeAll(() => {
    languageRepository.init([french, english, spanish, deutch]);
  });

  beforeEach(() => {
    profilesRepository.reset();
  });

  test('should generate tandems', async () => {
    const french1 = new Profile({
      user: userFactory.makeOne(),
      id: faker.string.uuid(),
      nativeLanguage: french,
      masteredLanguages: [],
      learningType: LearningType.BOTH,
      meetingFrequency: 'ONCE_A_WEEK',
      learningLanguages: [
        {
          language: english,
          level: ProficiencyLevel.B1,
        },
      ],
      sameGender: false,
      sameAge: false,
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const french2 = new Profile({
      user: userFactory.makeOne(),
      id: faker.string.uuid(),
      nativeLanguage: french,
      masteredLanguages: [deutch],
      learningType: LearningType.BOTH,
      meetingFrequency: 'ONCE_A_WEEK',
      learningLanguages: [
        {
          language: spanish,
          level: ProficiencyLevel.A2,
        },
        {
          language: english,
          level: ProficiencyLevel.C1,
        },
      ],
      sameGender: false,
      sameAge: false,
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const french3 = new Profile({
      user: userFactory.makeOne(),
      id: faker.string.uuid(),
      nativeLanguage: french,
      masteredLanguages: [],
      learningType: LearningType.BOTH,
      meetingFrequency: 'ONCE_A_WEEK',
      learningLanguages: [
        {
          language: english,
          level: ProficiencyLevel.B1,
        },
        {
          language: deutch,
          level: ProficiencyLevel.B2,
        },
      ],
      sameGender: false,
      sameAge: false,
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const spain1 = new Profile({
      user: userFactory.makeOne(),
      id: faker.string.uuid(),
      nativeLanguage: spanish,
      masteredLanguages: [],
      learningType: LearningType.BOTH,
      meetingFrequency: 'ONCE_A_WEEK',
      learningLanguages: [
        {
          language: french,
          level: ProficiencyLevel.B1,
        },
      ],
      sameGender: false,
      sameAge: false,
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const spain2 = new Profile({
      user: userFactory.makeOne(),
      id: faker.string.uuid(),
      nativeLanguage: spanish,
      masteredLanguages: [],
      learningType: LearningType.BOTH,
      meetingFrequency: 'ONCE_A_WEEK',
      learningLanguages: [
        {
          language: french,
          level: ProficiencyLevel.C1,
        },
        {
          language: english,
          level: ProficiencyLevel.B2,
        },
      ],
      sameGender: false,
      sameAge: false,
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const english1 = new Profile({
      user: userFactory.makeOne(),
      id: faker.string.uuid(),
      nativeLanguage: english,
      masteredLanguages: [],
      learningType: LearningType.BOTH,
      meetingFrequency: 'ONCE_A_WEEK',
      learningLanguages: [
        {
          language: french,
          level: ProficiencyLevel.C2,
        },
        {
          language: spanish,
          level: ProficiencyLevel.A0,
        },
      ],
      sameGender: false,
      sameAge: false,
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const english2 = new Profile({
      user: userFactory.makeOne(),
      id: faker.string.uuid(),
      nativeLanguage: english,
      masteredLanguages: [],
      learningType: LearningType.BOTH,
      meetingFrequency: 'ONCE_A_WEEK',
      learningLanguages: [
        {
          language: french,
          level: ProficiencyLevel.B1,
        },
      ],
      sameGender: false,
      sameAge: false,
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const deutch1 = new Profile({
      user: userFactory.makeOne(),
      id: faker.string.uuid(),
      nativeLanguage: deutch,
      masteredLanguages: [],
      learningType: LearningType.BOTH,
      meetingFrequency: 'ONCE_A_WEEK',
      learningLanguages: [
        {
          language: french,
          level: ProficiencyLevel.B1,
        },
      ],
      sameGender: false,
      sameAge: false,
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    profilesRepository.init([
      // 3 users from france
      french1,
      french2,
      french3,
      // 2 from spain
      spain1,
      spain2,
      // 2 user from england
      english1,
      english2,
      // 1 deutch
      deutch1,
    ]);

    const tandemsRepository = new InMemoryTandemRepository();
    const uuidProvider = new UuidProvider();

    const uc = new GenerateTandemsUsecase(
      profilesRepository,
      tandemsRepository,
      uuidProvider,
    );

    await uc.execute();

    const tandems = await tandemsRepository.getExistingTandems();

    for (const tandem of tandems) {
      expect(tandem.status).toBe(TandemStatus.DRAFT);
    }

    expect(
      checkTandemArrayContainsTandemWithProfiles(tandems, {
        a: french3,
        b: english2,
      }),
    ).toBeTruthy();
  });
});
