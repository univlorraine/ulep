import { Campus } from 'src/core/models/campus.model';
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
  University,
  User,
} from '../../src/core/models';
import { faker } from '@faker-js/faker';
import { MatchScorer, Matrix } from 'src/core/services/MatchScorer';

const isMatrixSymmetric = (matrix: Matrix): boolean => {
  const keys = Object.keys(matrix);

  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      const keyI = keys[i];
      const keyJ = keys[j];

      // Check if the corresponding keys exists
      if (
        matrix[keyI][keyJ] === undefined ||
        matrix[keyJ][keyI] === undefined
      ) {
        return false;
      }

      // Check if the elements are symmetric
      if (matrix[keyI][keyJ] !== matrix[keyJ][keyI]) {
        return false;
      }
    }
  }

  return true;
};

describe('Matrix', () => {
  const matchScorer = new MatchScorer();

  test('frequencyMatrix should be symetric', () => {
    expect(isMatrixSymmetric(matchScorer.frequencyMatrix)).toBe(true);
  });

  test('standardPairingLearningLanguagesCompatibilityMatrix should be symetric', () => {
    expect(
      isMatrixSymmetric(
        matchScorer.standardPairingLearningLanguagesCompatibilityMatrix,
      ),
    ).toBe(true);
  });

  test('discoveryPairingLearningLanguagesCompatibilityMatrix should be symetric', () => {
    expect(
      isMatrixSymmetric(
        matchScorer.discoveryPairingLearningLanguagesCompatibilityMatrix,
      ),
    ).toBe(true);
  });
});

describe('Score', () => {
  const matchScorer = new MatchScorer();

  const country = {
    id: 'id',
    emoji: '👽',
    name: 'France',
    code: 'fr',
    enable: true,
  } as CountryCode;
  const england = {
    id: 'en',
    emoji: '👽',
    name: 'England',
    code: 'en',
    enable: true,
  } as CountryCode;

  test('Should be symetric when learning languages are both joker language', () => {
    const jokerLanguage = new Language({
      id: 'joker',
      code: '*',
      mainUniversityStatus: LanguageStatus.PRIMARY,
      secondaryUniversityActive: true,
      isDiscovery: false,
    });

    const frenchLanguage = new Language({
      id: faker.string.uuid(),
      code: 'fr',
      name: 'french',
      mainUniversityStatus: LanguageStatus.PRIMARY,
      secondaryUniversityActive: true,
      isDiscovery: false,
    });
    const englishLanguage = new Language({
      id: faker.string.uuid(),
      code: 'en',
      name: 'english',
      mainUniversityStatus: LanguageStatus.PRIMARY,
      secondaryUniversityActive: true,
      isDiscovery: false,
    });
    const spanishLanguage = new Language({
      id: faker.string.uuid(),
      code: 'en',
      name: 'english',
      mainUniversityStatus: LanguageStatus.UNACTIVE,
      secondaryUniversityActive: true,
      isDiscovery: false,
    });
    const lorraineCampus = new Campus({
      id: 'campusLorraine',
      name: 'campus Lorraine',
      universityId: 'university1',
    });
    const centralUniversity = new University({
      id: 'university1',
      country: country,
      name: 'university 1',
      campus: [lorraineCampus],
      timezone: 'GMT+1',
      admissionStart: new Date(),
      admissionEnd: new Date(),
      openServiceDate: new Date(),
      closeServiceDate: new Date(),
      codes: [],
      domains: [],
      maxTandemsPerUser: 3,
      nativeLanguage: frenchLanguage,
    });
    const profile1 = new Profile({
      user: new User({
        id: 'user1',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STAFF,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR1',
      nativeLanguage: frenchLanguage,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const profile2 = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STAFF,
        country,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN1',
      nativeLanguage: spanishLanguage,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [],
      objectives: [],
      interests: [],
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const learningLanguage1 = new LearningLanguage({
      id: 'LL1',
      language: jokerLanguage,
      level: ProficiencyLevel.A0,
      profile: profile1,
      learningType: LearningType.BOTH,
      sameGender: false,
      sameAge: false,
    });
    const learningLanguage2 = new LearningLanguage({
      id: 'LL1',
      language: jokerLanguage,
      level: ProficiencyLevel.A0,
      profile: profile2,
      learningType: LearningType.BOTH,
      sameGender: false,
      sameAge: false,
    });

    const res = matchScorer.computeMatchScore(
      learningLanguage1,
      learningLanguage2,
      [frenchLanguage, englishLanguage],
    );
    const res2 = matchScorer.computeMatchScore(
      learningLanguage2,
      learningLanguage1,
      [frenchLanguage, englishLanguage],
    );

    expect(res.total).toBe(res2.total);
  });

  test('Should be null whenever a langage score is 0', () => {
    const country1 = {
      id: 'fr',
      emoji: '👽',
      name: 'France',
      code: 'fr',
      enable: true,
    } as CountryCode;
    const frenchLanguage = new Language({
      id: faker.string.uuid(),
      code: 'fr',
      name: 'french',
      mainUniversityStatus: LanguageStatus.PRIMARY,
      secondaryUniversityActive: true,
      isDiscovery: false,
    });
    const englishLanguage = new Language({
      id: faker.string.uuid(),
      code: 'en',
      name: 'english',
      mainUniversityStatus: LanguageStatus.PRIMARY,
      secondaryUniversityActive: true,
      isDiscovery: false,
    });
    const objectives: any = [
      {
        id: 'obj1',
        name: 'obj1',
      },
      {
        id: 'obj2',
        name: 'obj2',
      },
    ];
    const interests: any = [
      {
        id: 'interest1',
        name: 'obj1',
        category: {
          id: 'interestCategoryA',
        },
      },
      {
        id: 'interest2',
        name: 'obj1',
        category: {
          id: 'interestCategoryB',
        },
      },
    ];
    const lorraineCampus = new Campus({
      id: 'campusLorraine',
      name: 'campus Lorraine',
      universityId: 'university1',
    });
    const centralUniversity = new University({
      id: 'university1',
      country: country1,
      name: 'university 1',
      campus: [lorraineCampus],
      timezone: 'GMT+1',
      admissionStart: new Date(),
      admissionEnd: new Date(),
      openServiceDate: new Date(),
      closeServiceDate: new Date(),
      codes: [],
      domains: [],
      maxTandemsPerUser: 3,
      nativeLanguage: frenchLanguage,
    });
    const profile1 = new Profile({
      user: new User({
        id: 'user1',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STAFF,
        country: country1,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'FR1',
      nativeLanguage: frenchLanguage,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [],
      objectives,
      interests,
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const profile2 = new Profile({
      user: new User({
        id: 'user2',
        acceptsEmail: true,
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STAFF,
        country: england,
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN1',
      nativeLanguage: englishLanguage,
      masteredLanguages: [],
      testedLanguages: [],
      meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
      learningLanguages: [],
      objectives,
      interests,
      biography: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    });
    const learningLanguage1 = new LearningLanguage({
      id: 'LL1',
      language: englishLanguage,
      level: ProficiencyLevel.A0,
      profile: profile1,
      campus: lorraineCampus,
      learningType: LearningType.TANDEM,
      sameGender: true,
      sameAge: true,
    });
    const learningLanguage2 = new LearningLanguage({
      id: 'LL1',
      language: frenchLanguage,
      level: ProficiencyLevel.A0,
      profile: profile2,
      campus: lorraineCampus,
      learningType: LearningType.TANDEM,
      sameGender: true,
      sameAge: true,
    });

    const res = matchScorer.computeMatchScore(
      learningLanguage1,
      learningLanguage2,
      [frenchLanguage, englishLanguage],
    );
    expect(res.scores).toEqual({
      level: 0,
      age: 0,
      status: 0,
      goals: 0,
      interests: 0,
      meetingFrequency: 0,
      certificateOption: 0,
      isExclusive: 0,
    });
    expect(res.total).toBe(0);
  });
});
