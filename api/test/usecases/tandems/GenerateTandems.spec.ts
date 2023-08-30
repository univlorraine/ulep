import { faker } from '@faker-js/faker';
import {
  Gender,
  Language,
  LanguageStatus,
  LearningType,
  ProficiencyLevel,
  Profile,
  Role,
  Tandem,
  TandemStatus,
  University,
  User,
} from 'src/core/models';
import { Campus } from 'src/core/models/campus.model';
import { GenerateTandemsUsecase } from 'src/core/usecases';
import { InMemoryProfileRepository } from 'src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryTandemRepository } from 'src/providers/persistance/repositories/in-memory-tandem-repository';
import { UuidProvider } from 'src/providers/services/uuid.provider';

// Note: profile comparison is based on profiles ID
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

// Note: profile comparison is based on profiles ID
const checkTandemArrayNotContainsTandem = (
  tandems: Tandem[],
  tandemProfiles: { a: Profile; b: Profile },
) =>
  !tandems.some((tandem) => {
    const tandemProfileIds = tandem.profiles.map((profile) => profile.id);
    return (
      tandemProfileIds.includes(tandemProfiles.a.id) &&
      tandemProfileIds.includes(tandemProfiles.b.id)
    );
  });

describe('GenerateTandem UC', () => {
  ///////// Repositories /////////
  const profilesRepository = new InMemoryProfileRepository();
  const tandemsRepository = new InMemoryTandemRepository();
  const uuidProvider = new UuidProvider();
  const uc = new GenerateTandemsUsecase(
    profilesRepository,
    tandemsRepository,
    uuidProvider,
  );

  ///////// Data /////////
  const french = new Language({
    id: faker.string.uuid(),
    code: 'fr',
    name: 'french',
    mainUniversityStatus: LanguageStatus.PRIMARY,
    secondaryUniversityActive: true,
  });
  const english = new Language({
    id: faker.string.uuid(),
    code: 'en',
    name: 'english',
    mainUniversityStatus: LanguageStatus.PRIMARY,
    secondaryUniversityActive: true,
  });
  const spanish = new Language({
    id: faker.string.uuid(),
    code: 'es',
    name: 'spanish',
    mainUniversityStatus: LanguageStatus.PRIMARY,
    secondaryUniversityActive: true,
  });
  const deutch = new Language({
    id: faker.string.uuid(),
    code: 'de',
    name: 'deutch',
    mainUniversityStatus: LanguageStatus.PRIMARY,
    secondaryUniversityActive: true,
  });

  const lorraineCampus = new Campus({
    id: 'campusLorraine',
    name: 'campus Lorraine',
    universityId: 'university1',
  });
  const strasbourgCampus = new Campus({
    id: 'campusStrasbourg',
    name: 'campus Strasbourg',
    universityId: 'university1',
  });
  const centralUniversity = new University({
    id: 'university1',
    name: 'university 1',
    campus: [lorraineCampus, strasbourgCampus],
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
      age: 48,
      university: centralUniversity,
      role: Role.STAFF,
      country: 'ES',
      avatar: null,
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

  beforeEach(() => {
    profilesRepository.reset();
    tandemsRepository.reset();
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

    await uc.execute({
      universityIds: [centralUniversity.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();

    expect(tandems.length).toBe(3);

    for (const tandem of tandems) {
      expect(tandem.status).toBe(TandemStatus.DRAFT);
    }

    expect(
      checkTandemArrayContainsTandem(tandems, {
        a: french1,
        b: spain2,
      }) &&
        checkTandemArrayContainsTandem(tandems, {
          a: french2,
          b: deutch1,
        }) &&
        checkTandemArrayContainsTandem(tandems, {
          a: french3,
          b: english1,
        }),
    ).toBeTruthy();
  });

  test('should not generate tandems for user already having a tandem', async () => {
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

    profilesRepository.init(
      [
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
      ],
      existingTandems,
    );
    tandemsRepository.init(existingTandems);

    await uc.execute({
      universityIds: [centralUniversity.id],
    });

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

  test('should not generate tandem with user of 2 different gender if they will to be in same gender tandem', async () => {
    // Male speaking french and learning english
    const male = new Profile({
      user: new User({
        id: 'user1',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'FR',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'MALE1',
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
    // Female speaking english and learning french
    const female = new Profile({
      user: new User({
        id: 'user1',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.FEMALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'EN',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FEMALE',
      nativeLanguage: english,
      masteredLanguages: [],
      learningType: LearningType.BOTH,
      meetingFrequency: 'ONCE_A_WEEK',
      learningLanguages: [
        {
          language: french,
          level: ProficiencyLevel.B2,
        },
      ],
      sameGender: true,
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
    profilesRepository.init([male, female]);

    await uc.execute({
      universityIds: [centralUniversity.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();
    expect(
      checkTandemArrayNotContainsTandem(tandems, {
        a: male,
        b: female,
      }),
    ).toBeTruthy();
  });

  describe('should not generate tandems of incompatible learning type', () => {
    // French learning english in tandem
    const frenchTandem = new Profile({
      user: new User({
        id: 'user1',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'FR',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_TANDEM',
      nativeLanguage: french,
      masteredLanguages: [],
      learningType: LearningType.TANDEM,
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
      campus: lorraineCampus,
    });

    // English learning french in tandem
    const englishTandem = new Profile({
      user: new User({
        id: 'user2',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'EN',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_TANDEM',
      nativeLanguage: english,
      masteredLanguages: [],
      learningType: LearningType.TANDEM,
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
      campus: lorraineCampus,
    });

    // English learning french in tandem
    const englishTandemOtherSite = new Profile({
      user: new User({
        id: 'user2',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'EN',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_TANDEM',
      nativeLanguage: english,
      masteredLanguages: [],
      learningType: LearningType.TANDEM,
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
      campus: strasbourgCampus,
    });

    // French learning english in etandem
    const frenchEtandem = new Profile({
      user: new User({
        id: 'user3',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'FR',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_ETANDEM',
      nativeLanguage: french,
      masteredLanguages: [],
      learningType: LearningType.ETANDEM,
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

    // English learning french in etandem
    const englishEtandem = new Profile({
      user: new User({
        id: 'user4',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'EN',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_ETANDEM',
      nativeLanguage: english,
      masteredLanguages: [],
      learningType: LearningType.ETANDEM,
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

    // French learning english in whatever mode
    const frenchBoth = new Profile({
      user: new User({
        id: 'user5',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'FR',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_BOTH',
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

    // English learning french in whatever mode
    const englishBoth = new Profile({
      user: new User({
        id: 'user4',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'EN',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_BOTH',
      nativeLanguage: english,
      masteredLanguages: [],
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

    test('Tandem - Tandem', async () => {
      profilesRepository.init([frenchTandem, englishTandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchTandem,
          b: englishTandem,
        }),
      ).toBeTruthy();
    });

    test('Etandem - ETandem', async () => {
      profilesRepository.init([frenchEtandem, englishEtandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchEtandem,
          b: englishEtandem,
        }),
      ).toBeTruthy();
    });

    test('Both - whatever', async () => {
      profilesRepository.init([frenchBoth, englishTandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      let tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchBoth,
          b: englishTandem,
        }),
      ).toBeTruthy();

      profilesRepository.reset();
      tandemsRepository.reset();

      profilesRepository.init([frenchBoth, englishEtandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchBoth,
          b: englishEtandem,
        }),
      ).toBeTruthy();

      profilesRepository.reset();
      tandemsRepository.reset();

      profilesRepository.init([frenchBoth, englishBoth]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchBoth,
          b: englishBoth,
        }),
      ).toBeTruthy();
    });

    test('Tandem - ETandem', async () => {
      profilesRepository.init([frenchTandem, englishEtandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayNotContainsTandem(tandems, {
          a: frenchTandem,
          b: englishEtandem,
        }),
      ).toBeTruthy();
    });

    test('should not generate on site tandem if users are not in same campus', async () => {
      profilesRepository.init([frenchTandem, englishTandemOtherSite]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayNotContainsTandem(tandems, {
          a: frenchTandem,
          b: englishTandemOtherSite,
        }),
      ).toBeTruthy();
    });
  });

  test('should generate tandem only for selected universities', async () => {
    const campus1 = new Campus({
      id: 'campus1',
      name: 'campus 1',
      universityId: 'subsidiary1',
    });
    const campus2 = new Campus({
      id: 'campus2',
      name: 'campus 2',
      universityId: 'subsidiary1',
    });
    const subsidiaryUniveristy1 = new University({
      id: 'subsidiary1',
      name: 'Subsidiary university 1',
      parent: centralUniversity.id,
      campus: [campus1, campus2],
      timezone: 'GMT+1',
      admissionStart: new Date(),
      admissionEnd: new Date(),
    });
    const campusMadrid = new Campus({
      id: 'campusMadrid',
      name: 'campus Madrid',
      universityId: 'subsidiary2',
    });
    const subsidiaryUniveristy2 = new University({
      id: 'subsidiary2',
      name: 'Subsidiary university 2',
      parent: centralUniversity.id,
      campus: [campusMadrid],
      timezone: 'GMT+1',
      admissionStart: new Date(),
      admissionEnd: new Date(),
    });

    const studentSubsidiary1 = new Profile({
      user: new User({
        id: 's1subsidiary1',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country: 'EN',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_SUB',
      nativeLanguage: english,
      masteredLanguages: [],
      learningType: LearningType.ETANDEM,
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
    const studentSubsidiary2 = new Profile({
      user: new User({
        id: 's1subsidiary1',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy2,
        role: Role.STUDENT,
        country: 'ES',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'SP_SUB',
      nativeLanguage: spanish,
      masteredLanguages: [],
      learningType: LearningType.ETANDEM,
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

    profilesRepository.init([
      french1, // french learning english
      french2, // french learning spanish
      studentSubsidiary1, // english learning french
      studentSubsidiary2, // spanish learning french
    ]);
    await uc.execute({
      universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
    });
    const tandems = await tandemsRepository.getExistingTandems();
    expect(
      checkTandemArrayContainsTandem(tandems, {
        a: french1,
        b: studentSubsidiary1,
      }),
    ).toBeTruthy();
    expect(
      checkTandemArrayNotContainsTandem(tandems, {
        a: french2,
        b: studentSubsidiary2,
      }),
    ).toBeTruthy();
  });

  test('Generated tandems should always have a profile from central university', async () => {
    const subsidiaryUniveristy1 = new University({
      id: 'subsidiary1',
      name: 'Subsidiary university 1',
      parent: centralUniversity.id,
      campus: [],
      timezone: 'GMT+1',
      admissionStart: new Date(),
      admissionEnd: new Date(),
    });

    const profile1 = new Profile({
      user: new User({
        id: 's1subsidiary',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country: 'FR',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_SUB',
      nativeLanguage: french,
      masteredLanguages: [],
      learningType: LearningType.ETANDEM,
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
    const perfectMatchForProfile1 = new Profile({
      user: new User({
        id: 's2subsidiary',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country: 'EN',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_SUB',
      nativeLanguage: english,
      masteredLanguages: [],
      learningType: LearningType.ETANDEM,
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
    profilesRepository.init([profile1, perfectMatchForProfile1]);

    await uc.execute({
      universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();
    expect(
      checkTandemArrayNotContainsTandem(tandems, {
        a: profile1,
        b: perfectMatchForProfile1,
      }),
    ).toBeTruthy();
  });

  test('should generate tandem for user from central university that registered first', async () => {
    const subsidiaryUniveristy1 = new University({
      id: 'subsidiary1',
      name: 'Subsidiary university 1',
      parent: centralUniversity.id,
      campus: [],
      timezone: 'GMT+1',
      admissionStart: new Date(),
      admissionEnd: new Date(),
    });
    const firstUser = new Profile({
      user: new User({
        id: 'user1',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: 'FR',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_1',
      nativeLanguage: french,
      masteredLanguages: [],
      learningType: LearningType.ETANDEM,
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
      createdAt: new Date('2023-08-28T10:00:00.000Z'),
    });
    // second user is better match but register later
    const secondUser = new Profile({
      user: new User({
        id: 'user2',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.FEMALE,
        age: 50,
        university: centralUniversity,
        role: Role.STAFF,
        country: 'FR',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_2',
      nativeLanguage: french,
      masteredLanguages: [],
      learningType: LearningType.ETANDEM,
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
      createdAt: new Date('2023-08-12T10:00:00.000Z'),
    });
    const match = new Profile({
      user: new User({
        id: 'user3',
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country: 'EN',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_1',
      nativeLanguage: english,
      masteredLanguages: [],
      learningType: LearningType.ETANDEM,
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
      createdAt: new Date('2023-08-04T10:00:00.000Z'),
    });

    profilesRepository.init([firstUser, match, secondUser]);

    await uc.execute({
      universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();
    expect(
      checkTandemArrayContainsTandem(tandems, {
        a: match,
        b: secondUser,
      }),
    ).toBeTruthy();
  });
});
