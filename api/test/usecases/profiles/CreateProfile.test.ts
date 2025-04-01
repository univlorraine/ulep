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

import {
  InterestFactory,
  LanguageFactory,
  UniversityFactory,
  UserFactory,
} from '@app/common';
import { CreateProfileUsecase } from '../../../src/core/usecases';
import {
  LearningType,
  MeetingFrequency,
  ProficiencyLevel,
} from '../../../src/core/models';
import {
  RessourceDoesNotExist,
  UnsuportedLanguageException,
} from '../../../src/core/errors';
import { ProfileLanguagesException } from '../../../src/core/errors/profile-exceptions';
import { InMemoryInterestRepository } from '../../../src/providers/persistance/repositories/in-memory-interest.repository';
import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { InMemoryUserRepository } from '../../../src/providers/persistance/repositories/in-memory-user-repository';
import { InMemoryLearningObjectiveRepository } from '../../../src/providers/persistance/repositories/in-memory-objective.repository';
import InMemoryEmailGateway from '../../../src/providers/gateway/in-memory-email.gateway';
import { UuidProvider } from '../../../src/providers/services/uuid.provider';
import { InMemoryTandemHistoryRepository } from 'src/providers/persistance/repositories/in-memory-tandem-history.repository';
import { InMemoryLearningLanguageRepository } from 'src/providers/persistance/repositories/in-memory-learning-language-repository';

describe('CreateProfile', () => {
  const userFactory = new UserFactory();
  const universityFactory = new UniversityFactory();
  const languageFactory = new LanguageFactory();
  const interestFactory = new InterestFactory();

  const userRepository = new InMemoryUserRepository();
  const profileRepository = new InMemoryProfileRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const languageRepository = new InMemoryLanguageRepository();
  const learningLanguageRepository = new InMemoryLearningLanguageRepository();
  const interestRepository = new InMemoryInterestRepository();
  const objectivesRepository = new InMemoryLearningObjectiveRepository();
  const tandemHistoryRepository = new InMemoryTandemHistoryRepository();
  const uuidProvider = new UuidProvider();
  const emailGateway = new InMemoryEmailGateway();

  const learningLanguage = languageFactory.makeOne({
    id: 'uuid-1',
    code: 'en',
  });

  const nativeLanguage = languageFactory.makeOne({
    id: 'uuid-2',
    code: 'fr',
  });

  const masteredLanguage = languageFactory.makeOne({
    id: 'uuid-3',
    code: 'de',
  });

  const unvailableLanguage = languageFactory.makeOne({
    id: 'uuid-4',
    code: 'es',
  });

  const languages = [learningLanguage, nativeLanguage, masteredLanguage];

  const university = universityFactory.makeOne();

  const user = userFactory.makeOne({
    university: university,
  });

  const interest = interestFactory.makeOne();

  const createProfileUsecase = new CreateProfileUsecase(
    userRepository,
    profileRepository,
    learningLanguageRepository,
    languageRepository,
    interestRepository,
    objectivesRepository,
    tandemHistoryRepository,
    uuidProvider,
    emailGateway,
  );

  beforeEach(async () => {
    userRepository.reset();
    profileRepository.reset();
    universityRepository.reset();
    languageRepository.reset();

    userRepository.init([user]);
    interestRepository.init([interest]);
    languageRepository.init([...languages, unvailableLanguage]);
  });

  // it('should create a profile', async () => {
  //   const profile = await createProfileUsecase.execute({
  //     id: 'uuid-1',
  //     user: user.id,
  //     nativeLanguageCode: nativeLanguage.code,
  //     learningLanguageCode: learningLanguage.code,
  //     masteredLanguageCodes: [masteredLanguage.code],
  //     proficiencyLevel: ProficiencyLevel.B2,
  //     learningType: LearningType.ETANDEM,
  //     goals: [],
  //     meetingFrequency: 'ONCE_A_WEEK',
  //     interests: [interest.id],
  //     sameGender: true,
  //     sameAge: true,
  //     bios: 'I am a student',
  //   });

  //   expect(profile).toBeDefined();
  //   expect(profile.id).toBe('uuid-1');
  // });

  it('should throw an error if the user does not exist', async () => {
    let exception: Error | undefined;

    try {
      await createProfileUsecase.execute({
        user: 'uuid-that-does-not-exist',
        nativeLanguageCode: languages[0].code,
        learningLanguages: [
          {
            code: languages[1].code,
            level: ProficiencyLevel.B2,
            learningType: LearningType.ETANDEM,
            sameGender: true,
            sameAge: true,
            sameTandem: false,
          },
        ],
        objectives: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        interests: [interest.id],
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(RessourceDoesNotExist);
  });

  it('should throw an error if university do not accept learning language', async () => {
    let exception: Error | undefined;

    try {
      await createProfileUsecase.execute({
        user: user.id,
        nativeLanguageCode: nativeLanguage.code,
        learningLanguages: [
          {
            code: unvailableLanguage.code,
            level: ProficiencyLevel.B2,
            learningType: LearningType.ETANDEM,
            sameGender: true,
            sameAge: true,
            sameTandem: false,
          },
        ],
        objectives: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        interests: [interest.id],
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(UnsuportedLanguageException);
  });

  it('should throw an error if learningLanguage and nativeLanguage are equals', async () => {
    let exception: Error | undefined;

    try {
      await createProfileUsecase.execute({
        user: user.id,
        nativeLanguageCode: nativeLanguage.code,
        learningLanguages: [
          {
            code: nativeLanguage.code,
            level: ProficiencyLevel.B2,
            learningType: LearningType.ETANDEM,
            sameGender: true,
            sameAge: true,
            sameTandem: false,
          },
        ],
        objectives: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        interests: [interest.id],
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(ProfileLanguagesException);
  });

  it('should throw an error if mastered languages contains native language', async () => {
    let exception: Error | null = null;

    try {
      await createProfileUsecase.execute({
        user: user.id,
        nativeLanguageCode: nativeLanguage.code,
        learningLanguages: [
          {
            code: learningLanguage.code,
            level: ProficiencyLevel.B2,
            learningType: LearningType.ETANDEM,
            sameGender: true,
            sameAge: true,
            sameTandem: false,
          },
        ],
        masteredLanguageCodes: [nativeLanguage.code],
        objectives: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        interests: [interest.id],
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(ProfileLanguagesException);
  });

  it('should throw an error if mastered languages contains learning language', async () => {
    let exception: Error | undefined;

    try {
      await createProfileUsecase.execute({
        user: user.id,
        nativeLanguageCode: nativeLanguage.code,
        learningLanguages: [
          {
            code: learningLanguage.code,
            level: ProficiencyLevel.B2,
            learningType: LearningType.ETANDEM,
            sameGender: true,
            sameAge: true,
            sameTandem: false,
          },
        ],
        masteredLanguageCodes: [learningLanguage.code],
        objectives: [],
        meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
        interests: [interest.id],
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeInstanceOf(ProfileLanguagesException);
  });
});
