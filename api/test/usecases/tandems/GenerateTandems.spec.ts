import { faker } from '@faker-js/faker';
import {
  CountryCode,
  Gender,
  Language,
  LanguageStatus,
  LearningLanguage,
  LearningType,
  MeetingFrequency,
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
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import { InMemoryCountryCodesRepository } from 'src/providers/persistance/repositories/in-memory-country-repository';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryLearningLanguageRepository } from 'src/providers/persistance/repositories/in-memory-learning-language-repository';
import { InMemoryRefusedTandemsRepository } from 'src/providers/persistance/repositories/in-memory-refused-tandems-repository';
import { InMemoryTandemRepository } from 'src/providers/persistance/repositories/in-memory-tandem-repository';
import { InMemoryChatService } from 'src/providers/services/in-memory.chat.service';
import { UuidProvider } from 'src/providers/services/uuid.provider';

// Note: learning language comparison is based on ID
const checkTandemArrayContainsTandem = (
  tandems: Tandem[],
  learningLanguages: { a: LearningLanguage; b: LearningLanguage },
  tandemStatus?: TandemStatus,
) => {
  const matchingTandem = tandems.find((tandem) => {
    const tandemProfileIds = tandem.learningLanguages.map((ll) => ll.id);
    return (
      tandemProfileIds.includes(learningLanguages.a.id) &&
      tandemProfileIds.includes(learningLanguages.b.id)
    );
  });
  if (!matchingTandem) {
    return false;
  }

  return tandemStatus ? matchingTandem.status === tandemStatus : true;
};

// Note: learning languages comparison is based on ID
const checkTandemArrayNotContainsTandem = (
  tandems: Tandem[],
  learningLanguages: { a: LearningLanguage; b: LearningLanguage },
) =>
  !tandems.some((tandem) => {
    const tandemProfileIds = tandem.learningLanguages.map((ll) => ll.id);
    return (
      tandemProfileIds.includes(learningLanguages.a.id) &&
      tandemProfileIds.includes(learningLanguages.b.id)
    );
  });

describe('GenerateTandem UC', () => {
  ///////// Repositories /////////
  const countryRepository = new InMemoryCountryCodesRepository();
  const tandemsRepository = new InMemoryTandemRepository();
  const learningLanguageRepository = new InMemoryLearningLanguageRepository();
  const uuidProvider = new UuidProvider();
  const languageRepository = new InMemoryLanguageRepository();
  const refusedTandemsRepository = new InMemoryRefusedTandemsRepository();
  const inMemoryEmailGateway = new InMemoryEmailGateway();
  const chatService = new InMemoryChatService();

  const uc = new GenerateTandemsUsecase(
    tandemsRepository,
    learningLanguageRepository,
    uuidProvider,
    languageRepository,
    refusedTandemsRepository,
    inMemoryEmailGateway,
    chatService,
  );

  ///////// Data /////////
  const french = new Language({
    id: faker.string.uuid(),
    code: 'fr',
    name: 'french',
    mainUniversityStatus: LanguageStatus.PRIMARY,
    secondaryUniversityActive: true,
    isDiscovery: false,
  });
  const english = new Language({
    id: faker.string.uuid(),
    code: 'en',
    name: 'english',
    mainUniversityStatus: LanguageStatus.PRIMARY,
    secondaryUniversityActive: true,
    isDiscovery: false,
  });
  const spanish = new Language({
    id: faker.string.uuid(),
    code: 'es',
    name: 'spanish',
    mainUniversityStatus: LanguageStatus.PRIMARY,
    secondaryUniversityActive: true,
    isDiscovery: false,
  });
  const deutch = new Language({
    id: faker.string.uuid(),
    code: 'de',
    name: 'deutch',
    mainUniversityStatus: LanguageStatus.PRIMARY,
    secondaryUniversityActive: true,
    isDiscovery: false,
  });
  const joker = new Language({
    id: faker.string.uuid(),
    code: '*',
    name: 'joker',
    mainUniversityStatus: LanguageStatus.PRIMARY,
    secondaryUniversityActive: true,
    isDiscovery: false,
  });
  const otherLanguage = new Language({
    id: faker.string.uuid(),
    code: 'ot',
    name: 'other',
    mainUniversityStatus: LanguageStatus.UNACTIVE,
    secondaryUniversityActive: false,
    isDiscovery: false,
  });
  languageRepository.init([
    french,
    english,
    spanish,
    deutch,
    joker,
    otherLanguage,
  ]);

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
  const country = {
    id: 'fr',
    emoji: '👽',
    name: 'France',
    code: 'fr',
    enable: true,
  } as CountryCode;
  const spain = {
    id: 'sp',
    emoji: '👽',
    name: 'Spain',
    code: 'sp',
    enable: true,
  } as CountryCode;
  const england = {
    id: 'en',
    emoji: '👽',
    name: 'England',
    code: 'en',
    enable: true,
  } as CountryCode;
  const germany = {
    id: 'ge',
    emoji: '👽',
    name: 'Germany',
    code: 'ge',
    enable: true,
  } as CountryCode;

  countryRepository.init([country]);

  const centralUniversity = new University({
    id: 'university1',
    country,
    name: 'university 1',
    campus: [lorraineCampus, strasbourgCampus],
    timezone: 'GMT+1',
    admissionStart: new Date(),
    admissionEnd: new Date(),
    openServiceDate: new Date(),
    closeServiceDate: new Date(),
    codes: [],
    domains: [],
    maxTandemsPerUser: 3,
    nativeLanguage: french,
  });

  const partnerUniversity = new University({
    id: 'university2',
    country,
    name: 'university 2',
    campus: [],
    parent: centralUniversity.id,
    timezone: 'GMT+1',
    admissionStart: new Date(),
    admissionEnd: new Date(),
    openServiceDate: new Date(),
    closeServiceDate: new Date(),
    codes: [],
    domains: [],
    maxTandemsPerUser: 3,
    nativeLanguage: french,
  });

  const french1 = new Profile({
    user: new User({
      id: 'user1',
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 19,
      university: centralUniversity,
      role: Role.STUDENT,
      country,
      avatar: null,
      deactivatedReason: '',
    }),
    id: 'FR1',
    nativeLanguage: french,
    masteredLanguages: [],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    learningLanguages: [
      new LearningLanguage({
        id: 'FR1-LL_EN_B2',
        language: english,
        learningType: LearningType.BOTH,
        level: ProficiencyLevel.B2,
        sameGender: false,
        sameAge: false,
      }),
    ],
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
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.FEMALE,
      age: 20,
      university: centralUniversity,
      role: Role.STUDENT,
      country,
      avatar: null,
      deactivatedReason: '',
    }),
    id: 'FR2',
    nativeLanguage: french,
    masteredLanguages: [deutch],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    learningLanguages: [
      new LearningLanguage({
        id: 'FR2-LL_SP_A2',
        language: spanish,
        level: ProficiencyLevel.A2,
        learningType: LearningType.BOTH,
        sameGender: false,
        sameAge: false,
      }),
    ],
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
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 19,
      university: centralUniversity,
      role: Role.STUDENT,
      country,
      avatar: null,
      deactivatedReason: '',
    }),
    id: 'FR3',
    nativeLanguage: french,
    masteredLanguages: [],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    learningLanguages: [
      new LearningLanguage({
        id: 'FR3-LL_EN_A1',
        language: english,
        level: ProficiencyLevel.A1,
        learningType: LearningType.BOTH,
        sameGender: false,
        sameAge: false,
      }),
    ],
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
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 48,
      university: centralUniversity,
      role: Role.STUDENT,
      country: spain,
      avatar: null,
      deactivatedReason: '',
    }),
    id: 'SP1',
    nativeLanguage: spanish,
    masteredLanguages: [],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.TWICE_A_MONTH,
    learningLanguages: [
      new LearningLanguage({
        id: 'SP1-LL_FR_B1',
        language: french,
        level: ProficiencyLevel.A2,
        learningType: LearningType.BOTH,
        sameGender: false,
        sameAge: false,
      }),
    ],
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
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 19,
      university: centralUniversity,
      role: Role.STUDENT,
      country: spain,
      avatar: null,
      deactivatedReason: '',
    }),
    id: 'SP2',
    nativeLanguage: spanish,
    masteredLanguages: [english],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    learningLanguages: [
      new LearningLanguage({
        id: 'SP2-LL_FR_B2',
        language: french,
        level: ProficiencyLevel.B2,
        learningType: LearningType.BOTH,
        sameGender: false,
        sameAge: false,
      }),
    ],
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
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 19,
      university: centralUniversity,
      role: Role.STUDENT,
      country: england,
      avatar: null,
      deactivatedReason: '',
    }),
    id: 'EN1',
    nativeLanguage: english,
    masteredLanguages: [],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    learningLanguages: [
      new LearningLanguage({
        id: 'EN1-LL_FR_C2',
        language: french,
        level: ProficiencyLevel.C2,
        learningType: LearningType.BOTH,
        sameGender: false,
        sameAge: false,
      }),
    ],
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
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 28,
      university: centralUniversity,
      role: Role.STUDENT,
      country: england,
      avatar: null,
      deactivatedReason: '',
    }),
    id: 'EN2',
    nativeLanguage: english,
    masteredLanguages: [],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    learningLanguages: [
      new LearningLanguage({
        id: 'EN2-LL_FR_B1',
        language: french,
        level: ProficiencyLevel.B1,
        learningType: LearningType.BOTH,
        sameGender: false,
        sameAge: false,
      }),
    ],
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
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.FEMALE,
      age: 25,
      university: centralUniversity,
      role: Role.STUDENT,
      country: germany,
      avatar: null,
      deactivatedReason: '',
    }),
    id: 'DE',
    nativeLanguage: deutch,
    masteredLanguages: [spanish],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    learningLanguages: [
      new LearningLanguage({
        id: 'DE-LL_FR_B1',
        language: french,
        level: ProficiencyLevel.B1,
        learningType: LearningType.BOTH,
        sameGender: false,
        sameAge: false,
      }),
    ],
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
    tandemsRepository.reset();
    learningLanguageRepository.reset();
  });

  test('should generate tandems', async () => {
    const profiles = [
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
    ];
    learningLanguageRepository.init(profiles);

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
        a: french1.learningLanguages[0],
        b: spain2.learningLanguages[0],
      }) &&
        checkTandemArrayContainsTandem(tandems, {
          a: french2.learningLanguages[0],
          b: deutch1.learningLanguages[0],
        }) &&
        checkTandemArrayContainsTandem(tandems, {
          a: french3.learningLanguages[0],
          b: english1.learningLanguages[0],
        }),
    ).toBeTruthy();
  });

  test('should not generate tandems for user already having an active tandem', async () => {
    const existingTandems = [
      new Tandem({
        id: 'tandem1',
        learningLanguages: [
          new LearningLanguage({
            ...french1.learningLanguages[0],
            profile: french1,
          }),
          new LearningLanguage({
            ...english1.learningLanguages[0],
            profile: english1,
          }),
        ],
        learningType: LearningType.TANDEM,
        status: TandemStatus.ACTIVE,
        compatibilityScore: 0.1,
      }),
      new Tandem({
        id: 'tandem2',
        learningLanguages: [
          new LearningLanguage({
            ...french2.learningLanguages[0],
            profile: french2,
          }),
          new LearningLanguage({
            ...spain2.learningLanguages[0],
            profile: spain2,
          }),
        ],
        learningType: LearningType.TANDEM,
        status: TandemStatus.ACTIVE,
        compatibilityScore: 0.1,
      }),
    ];

    const profiles = [
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
    ];

    learningLanguageRepository.init(profiles, existingTandems);
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
          a: french1.learningLanguages[0],
          b: english1.learningLanguages[0],
        },
        TandemStatus.ACTIVE,
      ) &&
        checkTandemArrayContainsTandem(
          tandems,
          {
            a: french2.learningLanguages[0],
            b: spain2.learningLanguages[0],
          },
          TandemStatus.ACTIVE,
          // TandemStatus.DRAFT,
        ) &&
        checkTandemArrayContainsTandem(
          tandems,
          {
            a: french3.learningLanguages[0],
            b: english2.learningLanguages[0],
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
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'MALE1',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'MALE1-EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          learningType: LearningType.BOTH,
          sameGender: false,
          sameAge: false,
        }),
      ],
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
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.FEMALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FEMALE',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FEMALE-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.BOTH,
          sameGender: true,
          sameAge: false,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    learningLanguageRepository.init([male, female]);

    await uc.execute({
      universityIds: [centralUniversity.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();
    expect(
      checkTandemArrayNotContainsTandem(tandems, {
        a: male.learningLanguages[0],
        b: female.learningLanguages[0],
      }),
    ).toBeTruthy();
  });

  describe('should not generate tandems of incompatible learning type', () => {
    // French learning english in tandem
    const frenchTandem = new Profile({
      user: new User({
        id: 'user1',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_TANDEM',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_TANDEM-EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          learningType: LearningType.TANDEM,
          sameGender: false,
          sameAge: false,
          campus: lorraineCampus,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    // English learning french in tandem
    const englishTandem = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_TANDEM',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'EN_TANDEM-LOR-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.TANDEM,
          sameGender: false,
          sameAge: false,
          campus: lorraineCampus,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    // English learning french in tandem
    const englishTandemOtherSite = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_TANDEM',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'EN_TANDEM-STR-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.TANDEM,
          sameGender: false,
          sameAge: false,
          campus: strasbourgCampus,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    // French learning english in etandem
    const frenchEtandem = new Profile({
      user: new User({
        id: 'user3',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_ETANDEM',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_ETANDEM-EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    const frenchPartnerEtandem = new Profile({
      user: new User({
        id: 'user3',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: partnerUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_ETANDEM',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_ETANDEM-EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
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
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_ETANDEM',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'EN_ETANDEM-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
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
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_BOTH',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_BOTH-EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          learningType: LearningType.BOTH,
          sameGender: false,
          sameAge: false,
          campus: lorraineCampus,
        }),
      ],
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
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_BOTH',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'EN_BOTH-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.BOTH,
          sameGender: false,
          sameAge: false,
        }),
      ],
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
      learningLanguageRepository.init([frenchTandem, englishTandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchTandem.learningLanguages[0],
          b: englishTandem.learningLanguages[0],
        }),
      ).toBeTruthy();
    });

    test('Etandem central - Etandem central', async () => {
      learningLanguageRepository.init([frenchEtandem, englishEtandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchEtandem.learningLanguages[0],
          b: englishEtandem.learningLanguages[0],
        }),
      ).toBeFalsy();
    });

    test('Etandem central - Etandem partner', async () => {
      learningLanguageRepository.init([frenchPartnerEtandem, englishEtandem]);
      await uc.execute({
        universityIds: [centralUniversity.id, partnerUniversity.id],
      });
      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchPartnerEtandem.learningLanguages[0],
          b: englishEtandem.learningLanguages[0],
        }),
      ).toBeTruthy();
    });

    test('Both - whatever', async () => {
      learningLanguageRepository.init([frenchBoth, englishTandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      let tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchBoth.learningLanguages[0],
          b: englishTandem.learningLanguages[0],
        }),
      ).toBeTruthy();

      tandemsRepository.reset();
      learningLanguageRepository.reset();

      learningLanguageRepository.init([frenchBoth, englishEtandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchBoth.learningLanguages[0],
          b: englishEtandem.learningLanguages[0],
        }),
      ).toBeTruthy();

      tandemsRepository.reset();
      learningLanguageRepository.reset();

      learningLanguageRepository.init([frenchBoth, englishBoth]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: frenchBoth.learningLanguages[0],
          b: englishBoth.learningLanguages[0],
        }),
      ).toBeTruthy();
    });

    test('Tandem - ETandem', async () => {
      learningLanguageRepository.init([frenchTandem, englishEtandem]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayNotContainsTandem(tandems, {
          a: frenchTandem.learningLanguages[0],
          b: englishEtandem.learningLanguages[0],
        }),
      ).toBeTruthy();
    });

    test('should not generate on site tandem if users are not in same campus', async () => {
      learningLanguageRepository.init([frenchTandem, englishTandemOtherSite]);
      await uc.execute({
        universityIds: [centralUniversity.id],
      });
      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayNotContainsTandem(tandems, {
          a: frenchTandem.learningLanguages[0],
          b: englishTandemOtherSite.learningLanguages[0],
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
      openServiceDate: new Date(),
      closeServiceDate: new Date(),
      country,
      codes: [],
      domains: [],
      maxTandemsPerUser: 3,
      nativeLanguage: french,
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
      openServiceDate: new Date(),
      closeServiceDate: new Date(),
      country,
      codes: [],
      domains: [],
      maxTandemsPerUser: 3,
      nativeLanguage: french,
    });

    const studentSubsidiary1 = new Profile({
      user: new User({
        id: 's1subsidiary1',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_SUB',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'EN_SUB-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
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
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy2,
        role: Role.STUDENT,
        country: spain,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'SP_SUB',
      nativeLanguage: spanish,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'SP_SUB-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    learningLanguageRepository.init([
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
        a: french1.learningLanguages[0],
        b: studentSubsidiary1.learningLanguages[0],
      }),
    ).toBeTruthy();
    expect(
      checkTandemArrayNotContainsTandem(tandems, {
        a: french2.learningLanguages[0],
        b: studentSubsidiary2.learningLanguages[0],
      }),
    ).toBeTruthy();
  });

  test('should generate tandem with specific language available on partner', async () => {
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
      openServiceDate: new Date(),
      closeServiceDate: new Date(),
      country,
      codes: [],
      domains: [],
      maxTandemsPerUser: 3,
      specificLanguagesAvailable: [otherLanguage],
      nativeLanguage: french,
    });

    const studentSubsidiary = new Profile({
      user: new User({
        id: 's1subsidiary1',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_SUB',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'OT_B2',
          language: otherLanguage,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const studentCentral = new Profile({
      user: new User({
        id: 's1subsidiary1',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: spain,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'SP_SUB',
      nativeLanguage: otherLanguage,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'SP_SUB-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    learningLanguageRepository.init([
      studentSubsidiary, // french learning other
      studentCentral, // other learning french
    ]);
    await uc.execute({
      universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
    });
    const tandems = await tandemsRepository.getExistingTandems();

    expect(
      checkTandemArrayContainsTandem(tandems, {
        a: studentSubsidiary.learningLanguages[0],
        b: studentCentral.learningLanguages[0],
      }),
    ).toBeTruthy();
  });

  test('should not generate tandem if langauge are not permitted', async () => {
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
      openServiceDate: new Date(),
      closeServiceDate: new Date(),
      country,
      codes: [],
      domains: [],
      maxTandemsPerUser: 3,
      nativeLanguage: french,
    });

    const studentSubsidiary = new Profile({
      user: new User({
        id: 's1subsidiary1',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_SUB',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'OT_B2',
          language: otherLanguage,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const studentCentral = new Profile({
      user: new User({
        id: 's1subsidiary1',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: spain,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'SP_SUB',
      nativeLanguage: otherLanguage,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'SP_SUB-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    learningLanguageRepository.init([
      studentSubsidiary, // french learning other
      studentCentral, // other learning french
    ]);
    await uc.execute({
      universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
    });
    const tandems = await tandemsRepository.getExistingTandems();

    expect(
      checkTandemArrayContainsTandem(tandems, {
        a: studentSubsidiary.learningLanguages[0],
        b: studentCentral.learningLanguages[0],
      }),
    ).toBeFalsy();
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
      openServiceDate: new Date(),
      closeServiceDate: new Date(),
      country,
      codes: [],
      domains: [],
      maxTandemsPerUser: 3,
      nativeLanguage: french,
    });

    const profile1 = new Profile({
      user: new User({
        id: 's1subsidiary',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_SUB',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_SUB-EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
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
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_SUB',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'EN_SUB-FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    learningLanguageRepository.init([profile1, perfectMatchForProfile1]);

    await uc.execute({
      universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();
    expect(
      checkTandemArrayNotContainsTandem(tandems, {
        a: profile1.learningLanguages[0],
        b: perfectMatchForProfile1.learningLanguages[0],
      }),
    ).toBeTruthy();
  });

  describe('priority in tandem generation', () => {
    const subsidiaryUniveristy1 = new University({
      id: 'subsidiary1',
      name: 'Subsidiary university 1',
      parent: centralUniversity.id,
      campus: [],
      timezone: 'GMT+1',
      admissionStart: new Date(),
      admissionEnd: new Date(),
      openServiceDate: new Date(),
      closeServiceDate: new Date(),
      country,
      codes: [],
      domains: [],
      maxTandemsPerUser: 3,
      nativeLanguage: french,
    });
    const match = new Profile({
      user: new User({
        id: 'user3',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: subsidiaryUniveristy1,
        role: Role.STUDENT,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN_1',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'EN_1-LL_FR_B2',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
          createdAt: new Date('2023-08-04T10:00:00.000Z'),
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    test('should generate tandem for priority tandem before other', async () => {
      const bestUser = new Profile({
        user: new User({
          id: 'user1',
          acceptsEmail: true,
          email: '',
          firstname: '',
          lastname: '',
          gender: Gender.MALE,
          age: 19,
          university: centralUniversity,
          role: Role.STUDENT,
          country,
          avatar: null,
          deactivatedReason: '',
        }),
        id: 'FR_1',
        nativeLanguage: french,
        masteredLanguages: [],
        testedLanguages: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        learningLanguages: [
          new LearningLanguage({
            id: 'FR_1-LL_EN_B2',
            language: english,
            level: ProficiencyLevel.B2,
            createdAt: new Date('2023-04-08T10:00:00.000Z'),
            learningType: LearningType.ETANDEM,
            sameGender: false,
            sameAge: false,
            specificProgram: false,
          }),
        ],
        objectives: [],
        interests: [],
        biography: {
          superpower: faker.lorem.sentence(),
          favoritePlace: faker.lorem.sentence(),
          experience: faker.lorem.sentence(),
          anecdote: faker.lorem.sentence(),
        },
      });

      const priorityUser = new Profile({
        user: new User({
          id: 'user2',
          acceptsEmail: true,
          email: '',
          firstname: '',
          lastname: '',
          gender: Gender.FEMALE,
          age: 50,
          university: centralUniversity,
          role: Role.STUDENT,
          country,
          avatar: null,
          deactivatedReason: '',
        }),
        id: 'FR_2',
        nativeLanguage: french,
        masteredLanguages: [],
        testedLanguages: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        learningLanguages: [
          new LearningLanguage({
            id: 'FR_2-LL_EN_B2',
            language: english,
            level: ProficiencyLevel.B2,
            createdAt: new Date('2023-04-18T10:00:00.000Z'),
            learningType: LearningType.ETANDEM,
            sameGender: false,
            sameAge: false,
            specificProgram: false,
            hasPriority: true,
          }),
        ],
        objectives: [],
        interests: [],
        biography: {
          superpower: faker.lorem.sentence(),
          favoritePlace: faker.lorem.sentence(),
          experience: faker.lorem.sentence(),
          anecdote: faker.lorem.sentence(),
        },
      });

      learningLanguageRepository.init([bestUser, match, priorityUser]);

      await uc.execute({
        universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
      });

      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: match.learningLanguages[0],
          b: priorityUser.learningLanguages[0],
        }),
      ).toBeTruthy();
    });

    test('should generate tandem for staff before student', async () => {
      const bestUser = new Profile({
        user: new User({
          id: 'user1',
          acceptsEmail: true,
          email: '',
          firstname: '',
          lastname: '',
          gender: Gender.MALE,
          age: 19,
          university: centralUniversity,
          role: Role.STUDENT,
          country,
          avatar: null,
          deactivatedReason: '',
        }),
        id: 'FR_1',
        nativeLanguage: french,
        masteredLanguages: [],
        testedLanguages: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        learningLanguages: [
          new LearningLanguage({
            id: 'FR_1-LL_EN_B2',
            language: english,
            level: ProficiencyLevel.B2,
            createdAt: new Date('2023-04-08T10:00:00.000Z'),
            learningType: LearningType.ETANDEM,
            sameGender: false,
            sameAge: false,
            specificProgram: false,
          }),
        ],
        objectives: [],
        interests: [],
        biography: {
          superpower: faker.lorem.sentence(),
          favoritePlace: faker.lorem.sentence(),
          experience: faker.lorem.sentence(),
          anecdote: faker.lorem.sentence(),
        },
      });
      // bestUser is better match but not in specific program
      const priorityUser = new Profile({
        user: new User({
          id: 'user2',
          acceptsEmail: true,
          email: '',
          firstname: '',
          lastname: '',
          gender: Gender.FEMALE,
          age: 50,
          university: centralUniversity,
          role: Role.STAFF,
          country,
          avatar: null,
          deactivatedReason: '',
        }),
        id: 'FR_2',
        nativeLanguage: french,
        masteredLanguages: [],
        testedLanguages: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        learningLanguages: [
          new LearningLanguage({
            id: 'FR_2-LL_EN_B2',
            language: english,
            level: ProficiencyLevel.B2,
            createdAt: new Date('2023-04-18T10:00:00.000Z'),
            learningType: LearningType.ETANDEM,
            sameGender: false,
            sameAge: false,
            specificProgram: false,
          }),
        ],
        objectives: [],
        interests: [],
        biography: {
          superpower: faker.lorem.sentence(),
          favoritePlace: faker.lorem.sentence(),
          experience: faker.lorem.sentence(),
          anecdote: faker.lorem.sentence(),
        },
      });

      learningLanguageRepository.init([bestUser, match, priorityUser]);

      await uc.execute({
        universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
      });

      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: match.learningLanguages[0],
          b: priorityUser.learningLanguages[0],
        }),
      ).toBeTruthy();
    });

    test('should generate tandem for learning languages with specific program first', async () => {
      const bestUser = new Profile({
        user: new User({
          id: 'user1',
          acceptsEmail: true,
          email: '',
          firstname: '',
          lastname: '',
          gender: Gender.MALE,
          age: 19,
          university: centralUniversity,
          role: Role.STUDENT,
          country,
          avatar: null,
          deactivatedReason: '',
        }),
        id: 'FR_1',
        nativeLanguage: french,
        masteredLanguages: [],
        testedLanguages: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        learningLanguages: [
          new LearningLanguage({
            id: 'FR_1-LL_EN_B2',
            language: english,
            level: ProficiencyLevel.B2,
            createdAt: new Date('2023-04-08T10:00:00.000Z'),
            learningType: LearningType.ETANDEM,
            sameGender: false,
            sameAge: false,
          }),
        ],
        objectives: [],
        interests: [],
        biography: {
          superpower: faker.lorem.sentence(),
          favoritePlace: faker.lorem.sentence(),
          experience: faker.lorem.sentence(),
          anecdote: faker.lorem.sentence(),
        },
      });

      // bestUser is better match but not in specific program
      const priorityUser = new Profile({
        user: new User({
          id: 'user2',
          acceptsEmail: true,
          email: '',
          firstname: '',
          lastname: '',
          gender: Gender.FEMALE,
          age: 50,
          university: centralUniversity,
          role: Role.STUDENT,
          country,
          avatar: null,
          deactivatedReason: '',
        }),
        id: 'FR_2',
        nativeLanguage: french,
        masteredLanguages: [],
        testedLanguages: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        learningLanguages: [
          new LearningLanguage({
            id: 'FR_2-LL_EN_B2',
            language: english,
            level: ProficiencyLevel.B2,
            createdAt: new Date('2023-04-18T10:00:00.000Z'),
            learningType: LearningType.ETANDEM,
            sameGender: false,
            sameAge: false,
            specificProgram: true,
          }),
        ],
        objectives: [],
        interests: [],
        biography: {
          superpower: faker.lorem.sentence(),
          favoritePlace: faker.lorem.sentence(),
          experience: faker.lorem.sentence(),
          anecdote: faker.lorem.sentence(),
        },
      });

      learningLanguageRepository.init([bestUser, match, priorityUser]);

      await uc.execute({
        universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
      });

      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: match.learningLanguages[0],
          b: priorityUser.learningLanguages[0],
        }),
      ).toBeTruthy();
    });

    test('should generate tandem for learning languages first registered from central university', async () => {
      const bestUser = new Profile({
        user: new User({
          id: 'user1',
          acceptsEmail: true,
          email: '',
          firstname: '',
          lastname: '',
          gender: Gender.MALE,
          age: 19,
          university: centralUniversity,
          role: Role.STUDENT,
          country,
          avatar: null,
          deactivatedReason: '',
        }),
        id: 'FR_1',
        nativeLanguage: french,
        masteredLanguages: [],
        testedLanguages: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        learningLanguages: [
          new LearningLanguage({
            id: 'FR_1-LL_EN_B2',
            language: english,
            level: ProficiencyLevel.B2,
            createdAt: new Date('2023-08-28T10:00:00.000Z'),
            learningType: LearningType.ETANDEM,
            sameGender: false,
            sameAge: false,
          }),
        ],
        objectives: [],
        interests: [],
        biography: {
          superpower: faker.lorem.sentence(),
          favoritePlace: faker.lorem.sentence(),
          experience: faker.lorem.sentence(),
          anecdote: faker.lorem.sentence(),
        },
      });

      // bestUser is a better match but register later than priorityUser
      const priorityUser = new Profile({
        user: new User({
          id: 'user2',
          acceptsEmail: true,
          email: '',
          firstname: '',
          lastname: '',
          gender: Gender.FEMALE,
          age: 50,
          university: centralUniversity,
          role: Role.STUDENT,
          country,
          avatar: null,
          deactivatedReason: '',
        }),
        id: 'FR_2',
        nativeLanguage: french,
        masteredLanguages: [],
        testedLanguages: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        learningLanguages: [
          new LearningLanguage({
            id: 'FR_2-LL_EN_B2',
            language: english,
            level: ProficiencyLevel.B2,
            createdAt: new Date('2023-08-12T10:00:00.000Z'),
            learningType: LearningType.ETANDEM,
            sameGender: false,
            sameAge: false,
          }),
        ],
        objectives: [],
        interests: [],
        biography: {
          superpower: faker.lorem.sentence(),
          favoritePlace: faker.lorem.sentence(),
          experience: faker.lorem.sentence(),
          anecdote: faker.lorem.sentence(),
        },
      });
      const match = new Profile({
        user: new User({
          id: 'user3',
          acceptsEmail: true,
          email: '',
          firstname: '',
          lastname: '',
          gender: Gender.MALE,
          age: 19,
          university: subsidiaryUniveristy1,
          role: Role.STUDENT,
          country: england,
          avatar: null,
          deactivatedReason: '',
        }),
        id: 'EN_1',
        nativeLanguage: english,
        masteredLanguages: [],
        testedLanguages: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        learningLanguages: [
          new LearningLanguage({
            id: 'EN_1-LL_FR_B2',
            language: french,
            level: ProficiencyLevel.B2,
            learningType: LearningType.ETANDEM,
            sameGender: false,
            sameAge: false,
            createdAt: new Date('2023-08-04T10:00:00.000Z'),
          }),
        ],
        objectives: [],
        interests: [],
        biography: {
          superpower: faker.lorem.sentence(),
          favoritePlace: faker.lorem.sentence(),
          experience: faker.lorem.sentence(),
          anecdote: faker.lorem.sentence(),
        },
      });

      learningLanguageRepository.init([bestUser, match, priorityUser]);

      await uc.execute({
        universityIds: [centralUniversity.id, subsidiaryUniveristy1.id],
      });

      const tandems = await tandemsRepository.getExistingTandems();
      expect(
        checkTandemArrayContainsTandem(tandems, {
          a: match.learningLanguages[0],
          b: priorityUser.learningLanguages[0],
        }),
      ).toBeTruthy();
    });
  });

  test('should generate tandem for exclusive learning language', async () => {
    const emailA = faker.internet.email();
    const emailB = faker.internet.email();

    const userA = new Profile({
      user: new User({
        id: 'user1',
        acceptsEmail: true,
        email: emailA,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_1',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
          sameTandemEmail: emailB,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    const userB = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: emailB,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_JOKER',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_JOKER',
          language: joker,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
          sameTandemEmail: emailA,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    learningLanguageRepository.init([userA, userB]);

    await uc.execute({
      universityIds: [centralUniversity.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();

    expect(
      checkTandemArrayContainsTandem(tandems, {
        a: userA.learningLanguages[0],
        b: userB.learningLanguages[0],
      }),
    ).toBeTruthy();
  });

  test('should NOT generate tandem for exclusive learning language', async () => {
    const emailA = faker.internet.email();
    const emailB = faker.internet.email();

    const userA = new Profile({
      user: new User({
        id: 'user1',
        acceptsEmail: true,
        email: emailA,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_1',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
          sameTandemEmail: emailB,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    const userB = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: emailB,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_JOKER',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_JOKER',
          language: joker,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    learningLanguageRepository.init([userA, userB]);

    await uc.execute({
      universityIds: [centralUniversity.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();

    expect(
      checkTandemArrayContainsTandem(tandems, {
        a: userA.learningLanguages[0],
        b: userB.learningLanguages[0],
      }),
    ).toBeFalsy();
  });

  test('joker language should only match with spoken/learnt language supported by univeristy', async () => {
    const ksCountry = {
      id: 'ks',
      emoji: '👽',
      name: '???',
      code: 'ks',
      enable: true,
    } as CountryCode;
    const profileLearningJoker = new Profile({
      user: new User({
        id: 'user1',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_JOKER',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_JOKER',
          language: joker,
          level: ProficiencyLevel.A0,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
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
    const potentialMatch = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country: ksCountry,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'KS',
      nativeLanguage: otherLanguage,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'KS-LL_FR',
          language: french,
          level: ProficiencyLevel.B2,
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
        }),
      ],
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

    learningLanguageRepository.init([profileLearningJoker, potentialMatch]);

    await uc.execute({
      universityIds: [centralUniversity.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();
    expect(
      checkTandemArrayNotContainsTandem(tandems, {
        a: profileLearningJoker.learningLanguages[0],
        b: potentialMatch.learningLanguages[0],
      }),
    ).toBeTruthy();
  });

  test('should generate tandem with Etandem learning type between partner and central university', async () => {
    const emailA = faker.internet.email();
    const emailB = faker.internet.email();

    const userA = new Profile({
      user: new User({
        id: 'user1',
        acceptsEmail: true,
        email: emailA,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_1',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.BOTH,
          sameGender: false,
          sameAge: false,
          sameTandemEmail: emailB,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    const userB = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: emailB,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: partnerUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_JOKER',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_JOKER',
          language: joker,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.ETANDEM,
          sameGender: false,
          sameAge: false,
          sameTandemEmail: emailA,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    learningLanguageRepository.init([userA, userB]);

    await uc.execute({
      universityIds: [centralUniversity.id, partnerUniversity.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();

    expect(tandems[0].learningType).toBe(LearningType.ETANDEM);
  });

  test('should generate tandem with Etandem learning type between two central university students with different campus', async () => {
    const emailA = faker.internet.email();
    const emailB = faker.internet.email();

    const userA = new Profile({
      user: new User({
        id: 'user1',
        acceptsEmail: true,
        email: emailA,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_1',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.BOTH,
          sameGender: false,
          sameAge: false,
          sameTandemEmail: emailB,
          campus: lorraineCampus,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    const userB = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: emailB,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_JOKER',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_JOKER',
          language: joker,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.BOTH,
          sameGender: false,
          sameAge: false,
          sameTandemEmail: emailA,
          campus: strasbourgCampus,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    learningLanguageRepository.init([userA, userB]);

    await uc.execute({
      universityIds: [centralUniversity.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();

    expect(tandems[0].learningType).toBe(LearningType.ETANDEM);
  });

  test('should generate tandem with Tandem learning type between two central university students with same campus', async () => {
    const emailA = faker.internet.email();
    const emailB = faker.internet.email();

    const userA = new Profile({
      user: new User({
        id: 'user1',
        acceptsEmail: true,
        email: emailA,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_1',
      nativeLanguage: french,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_EN_B2',
          language: english,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.BOTH,
          sameGender: false,
          sameAge: false,
          sameTandemEmail: emailB,
          campus: lorraineCampus,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    const userB = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: emailB,
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STUDENT,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR_JOKER',
      nativeLanguage: english,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [
        new LearningLanguage({
          id: 'FR_1-LL_JOKER',
          language: joker,
          level: ProficiencyLevel.B2,
          createdAt: new Date('2023-08-28T10:00:00.000Z'),
          learningType: LearningType.BOTH,
          sameGender: false,
          sameAge: false,
          sameTandemEmail: emailA,
          campus: lorraineCampus,
        }),
      ],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });

    learningLanguageRepository.init([userA, userB]);

    await uc.execute({
      universityIds: [centralUniversity.id],
    });

    const tandems = await tandemsRepository.getExistingTandems();

    expect(tandems[0].learningType).toBe(LearningType.TANDEM);
  });
});
