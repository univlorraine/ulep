import { Campus } from 'src/core/models/campus.model';
import {
  CountryCode,
  Gender,
  Language,
  LanguageStatus,
  LearningLanguage,
  LearningType,
  ProficiencyLevel,
  Profile,
  Role,
  University,
  User,
} from '../../src/core/models';
import { faker } from '@faker-js/faker';
import { MatchScorer } from 'src/core/services/MatchScorer';

describe('Score', () => {
  const matchScorer = new MatchScorer();

  test('Should be symetric when learning languages are both joker language', () => {
    const jokerLanguage = new Language({
      id: 'joker',
      code: '*',
      mainUniversityStatus: LanguageStatus.PRIMARY,
      secondaryUniversityActive: true,
    });

    const country = {
      id: 'id',
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
    });
    const englishLanguage = new Language({
      id: faker.string.uuid(),
      code: 'en',
      name: 'english',
      mainUniversityStatus: LanguageStatus.PRIMARY,
      secondaryUniversityActive: true,
    });
    const spanishLanguage = new Language({
      id: faker.string.uuid(),
      code: 'en',
      name: 'english',
      mainUniversityStatus: LanguageStatus.UNACTIVE,
      secondaryUniversityActive: true,
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
      codes: [],
      domains: [],
    });
    const profile1 = new Profile({
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
      nativeLanguage: frenchLanguage,
      masteredLanguages: [],
      meetingFrequency: 'ONCE_A_WEEK',
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
        email: '',
        firstname: '',
        lastname: '',
        gender: Gender.MALE,
        age: 19,
        university: centralUniversity,
        role: Role.STAFF,
        country: 'EN',
        avatar: null,
        deactivatedReason: '',
      }),
      id: 'EN1',
      nativeLanguage: spanishLanguage,
      masteredLanguages: [],
      meetingFrequency: 'ONCE_A_WEEK',
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
});
