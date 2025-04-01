/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
  University,
  User,
} from 'src/core/models';
import { Campus } from 'src/core/models/campus.model';
import { MatchScorer } from 'src/core/services/MatchScorer';
import { GetLearningLanguageMatchesUsecase } from 'src/core/usecases';
import { InMemoryLanguageRepository } from 'src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryLearningLanguageRepository } from 'src/providers/persistance/repositories/in-memory-learning-language-repository';
import { InMemoryRefusedTandemsRepository } from 'src/providers/persistance/repositories/in-memory-refused-tandems-repository';
import { InMemoryUniversityRepository } from 'src/providers/persistance/repositories/in-memory-university-repository';

describe('Get learning languages match', () => {
  ///////// Repositories /////////
  const learningLanguageRepository = new InMemoryLearningLanguageRepository();
  const languageRepository = new InMemoryLanguageRepository();
  const refusedTandemsRepository = new InMemoryRefusedTandemsRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const matchService = new MatchScorer();

  const uc = new GetLearningLanguageMatchesUsecase(
    learningLanguageRepository,
    languageRepository,
    matchService,
    refusedTandemsRepository,
    universityRepository,
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
  const franceCountry = {
    id: 'id',
    emoji: '👽',
    name: 'France',
    code: 'fr',
    enable: true,
  } as CountryCode;
  const england = {
    id: 'id2',
    emoji: '👽',
    name: 'England',
    code: 'en',
    enable: true,
  };

  const centralUniversity = new University({
    id: 'university1',
    country: franceCountry,
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
    country: england,
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
  universityRepository.init([centralUniversity, partnerUniversity]);

  const french1 = new Profile({
    user: new User({
      id: 'french1',
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 19,
      university: centralUniversity,
      role: Role.STUDENT,
      country: franceCountry,
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

  const english1 = new Profile({
    user: new User({
      id: 'english1',
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
      id: 'english2',
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 28,
      university: partnerUniversity,
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
  const english3 = new Profile({
    user: new User({
      id: 'english3',
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
    id: 'EN3',
    nativeLanguage: english,
    masteredLanguages: [],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    learningLanguages: [
      new LearningLanguage({
        id: 'EN3-LL_FR_C2',
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

  const french2 = new Profile({
    user: new User({
      id: 'french2',
      acceptsEmail: true,
      email: '',
      firstname: '',
      lastname: '',
      gender: Gender.MALE,
      age: 19,
      university: partnerUniversity,
      role: Role.STUDENT,
      country: franceCountry,
      avatar: null,
      deactivatedReason: '',
    }),
    id: 'FR2',
    nativeLanguage: french,
    masteredLanguages: [],
    testedLanguages: [],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    learningLanguages: [
      new LearningLanguage({
        id: 'FR2-LL_EN_A1',
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

  beforeEach(() => {
    learningLanguageRepository.reset();
  });

  test('should return matches for learning language', async () => {
    const profiles = [french1, french2, english1, english2, english3];
    learningLanguageRepository.init(profiles);

    const res = await uc.execute({
      id: french1.learningLanguages[0].id,
      universityIds: [centralUniversity.id, partnerUniversity.id],
    });

    expect(res.totalItems).toBe(3);
    expect(res.items.map((match) => match.target.id)).toEqual([
      english1.learningLanguages[0].id,
      english2.learningLanguages[0].id,
      english3.learningLanguages[0].id,
    ]);
  });

  test('should return N first matches for learning language', async () => {
    const profiles = [french1, french2, english1, english2, english3];
    learningLanguageRepository.init(profiles);

    const res = await uc.execute({
      id: french1.learningLanguages[0].id,
      count: 2,
      universityIds: [centralUniversity.id, partnerUniversity.id],
    });

    expect(res.totalItems).toBe(2);
    expect(res.items.map((match) => match.target.id)).toEqual([
      english1.learningLanguages[0].id,
      english2.learningLanguages[0].id,
    ]);
  });

  test('should return matches for learning languages and selected universities only', async () => {
    const profiles = [french1, french2, english1, english2, english3];
    learningLanguageRepository.init(profiles);

    const res = await uc.execute({
      id: french1.learningLanguages[0].id,
      universityIds: [partnerUniversity.id],
    });

    expect(res.totalItems).toBe(1);
    expect(res.items.map((match) => match.target.id)).toEqual([
      english2.learningLanguages[0].id,
    ]);
  });

  test('should return matches for learning languages with central university if profile is from partner university', async () => {
    const profiles = [french1, french2, english1, english2, english3];
    learningLanguageRepository.init(profiles);

    const res = await uc.execute({
      id: french2.learningLanguages[0].id,
      universityIds: [
        partnerUniversity.id,
        'whateverSinceItWillBeIgnoredByUseCase',
      ],
    });

    expect(res.totalItems).toBe(2);
    expect(res.items.map((match) => match.target.id)).toEqual([
      english1.learningLanguages[0].id,
      english3.learningLanguages[0].id,
    ]);
  });
});
