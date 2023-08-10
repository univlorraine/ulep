import { faker } from '@faker-js/faker';
import {
  Gender,
  Language,
  LearningType,
  ProficiencyLevel,
  Profile,
  Role,
  Tandem,
  TandemStatus,
  University,
  User,
} from 'src/core/models';
import { GenerateTandemsUsecase } from 'src/core/usecases';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryProfileRepository } from 'src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryTandemRepository } from 'src/providers/persistance/repositories/in-memory-tandem-repository';
import { UuidProvider } from 'src/providers/services/uuid.provider';

const checkTandemArrayContainsTandem = (
  tandems: Tandem[],
  tandemProfiles: { a: Profile; b: Profile },
  tandemStatus?: TandemStatus,
) => {
  const matchingTandem = tandems.find((tandem) => {
    const tandemProfileIds = tandem.profiles.map((profile) => profile.id);
    return (
      tandemProfileIds.includes(tandemProfiles.a.id) &&
      tandemProfileIds.includes(tandemProfiles.b.id)
    );
  });
  if (!matchingTandem) {
    return false;
  }

  return tandemStatus ? matchingTandem.status === tandemStatus : true;
};

describe('GenerateTandem UC', () => {
  const languageRepository = new InMemoryLanguageRepository();
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
  const centralUniversity = new University({
    id: 'university1',
    name: 'university 1',
    campus: ['lorraine', 'strasbourg'],
    languages: [french, english, spanish, deutch],
    timezone: 'GMT+1',
    admissionStart: new Date(),
    admissionEnd: new Date(),
  });

  const french1 = new Profile({
    user: new User({
      id: 'user1',
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 19,
      university: centralUniversity,
      role: Role.STAFF,
      country: 'FR',
      avatar: null,
      deactivated: false,
      deactivatedReason: '',
    }),
    id: 'FR1',
    nativeLanguage: french,
    masteredLanguages: [],
    learningType: LearningType.BOTH,
    meetingFrequency: 'ONCE_A_WEEK',
    learningLanguages: [
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
  const french2 = new Profile({
    user: new User({
      id: 'user2',
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.FEMALE,
      age: 20,
      university: centralUniversity,
      role: Role.STUDENT,
      country: 'FR',
      avatar: null,
      deactivated: false,
      deactivatedReason: '',
    }),
    id: 'FR2',
    nativeLanguage: french,
    masteredLanguages: [deutch],
    learningType: LearningType.BOTH,
    meetingFrequency: 'ONCE_A_WEEK',
    learningLanguages: [
      {
        language: spanish,
        level: ProficiencyLevel.A2,
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
    user: new User({
      id: 'user3',
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 19,
      university: centralUniversity,
      role: Role.STAFF,
      country: 'FR',
      avatar: null,
      deactivated: false,
      deactivatedReason: '',
    }),
    id: 'FR3',
    nativeLanguage: french,
    masteredLanguages: [],
    learningType: LearningType.BOTH,
    meetingFrequency: 'ONCE_A_WEEK',
    learningLanguages: [
      {
        language: english,
        level: ProficiencyLevel.A1,
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
    user: new User({
      id: 'user4',
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 22,
      university: centralUniversity,
      role: Role.STUDENT,
      country: 'ES',
      avatar: null,
      deactivated: false,
      deactivatedReason: '',
    }),
    id: 'SP1',
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
    user: new User({
      id: 'user5',
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.FEMALE,
      age: 19,
      university: centralUniversity,
      role: Role.STUDENT,
      country: 'ES',
      avatar: null,
      deactivated: false,
      deactivatedReason: '',
    }),
    id: 'SP2',
    nativeLanguage: spanish,
    masteredLanguages: [english],
    learningType: LearningType.BOTH,
    meetingFrequency: 'ONCE_A_WEEK',
    learningLanguages: [
      {
        language: french,
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
    user: new User({
      id: 'user6',
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 19,
      university: centralUniversity,
      role: Role.STUDENT,
      country: 'EN',
      avatar: null,
      deactivated: false,
      deactivatedReason: '',
    }),
    id: 'EN1',
    nativeLanguage: english,
    masteredLanguages: [],
    learningType: LearningType.BOTH,
    meetingFrequency: 'ONCE_A_WEEK',
    learningLanguages: [
      {
        language: french,
        level: ProficiencyLevel.C2,
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
    user: new User({
      id: 'user7',
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 28,
      university: centralUniversity,
      role: Role.STAFF,
      country: 'EN',
      avatar: null,
      deactivated: false,
      deactivatedReason: '',
    }),
    id: 'EN2',
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
    user: new User({
      id: 'user8',
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.FEMALE,
      age: 25,
      university: centralUniversity,
      role: Role.STUDENT,
      country: 'DE',
      avatar: null,
      deactivated: false,
      deactivatedReason: '',
    }),
    id: 'DE',
    nativeLanguage: deutch,
    masteredLanguages: [spanish],
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

  beforeAll(() => {
    languageRepository.init([french, english, spanish, deutch]);
  });

  beforeEach(() => {
    profilesRepository.reset();
  });

  test('should generate tandems', async () => {
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

    expect(tandems.length).toBe(3);

    for (const tandem of tandems) {
      expect(tandem.status).toBe(TandemStatus.DRAFT);
    }

    expect(
      checkTandemArrayContainsTandem(tandems, {
        a: french1,
        b: english1,
      }) &&
        checkTandemArrayContainsTandem(tandems, {
          a: french2,
          b: spain2,
        }) &&
        checkTandemArrayContainsTandem(tandems, {
          a: french3,
          b: english2,
        }),
    ).toBeTruthy();
  });

  test('should not generate tandems for user already having a tandem', async () => {
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
    const existingTandems = [
      new Tandem({
        id: 'tandem1',
        profiles: [french1, english1],
        status: TandemStatus.ACTIVE,
      }),
      new Tandem({
        id: 'tandem2',
        profiles: [french2, spain2],
        status: TandemStatus.DRAFT,
      }),
    ];
    tandemsRepository.init(existingTandems);

    const uuidProvider = new UuidProvider();

    const uc = new GenerateTandemsUsecase(
      profilesRepository,
      tandemsRepository,
      uuidProvider,
    );

    await uc.execute();

    const tandems = await tandemsRepository.getExistingTandems();

    expect(tandems.length).toBe(3);

    expect(
      checkTandemArrayContainsTandem(
        tandems,
        {
          a: french1,
          b: english1,
        },
        TandemStatus.ACTIVE,
      ) &&
        checkTandemArrayContainsTandem(
          tandems,
          {
            a: french2,
            b: spain2,
          },
          TandemStatus.DRAFT,
        ) &&
        checkTandemArrayContainsTandem(
          tandems,
          {
            a: french3,
            b: english2,
          },
          TandemStatus.DRAFT,
        ),
    ).toBeTruthy();
  });
});
