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

import { InstanceFactory } from '@app/common/database/factories/instance.factory';
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
import { CronService } from 'src/core/services/CronService';
import InMemoryEmailGateway from 'src/providers/gateway/in-memory-email.gateway';
import InMemoryNotificaitonGateway from 'src/providers/gateway/in-memory-notification.gateway';
import { InMemoryInstanceRepository } from 'src/providers/persistance/repositories/in-memory-instance-repository';
import { InMemoryLearningLanguageRepository } from 'src/providers/persistance/repositories/in-memory-learning-language-repository';
import { InMemorySessionRepository } from 'src/providers/persistance/repositories/in-memory-session-repository';
import { InMemoryTandemRepository } from 'src/providers/persistance/repositories/in-memory-tandem-repository';
import { InMemoryUniversityRepository } from 'src/providers/persistance/repositories/in-memory-university-repository';

const country = {
  id: 'fr',
  emoji: '👽',
  name: 'France',
  code: 'fr',
  enable: true,
} as CountryCode;

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
const endServiceDate = new Date('01/01/2025');
const centralUniversity = new University({
  id: 'university1',
  country,
  name: 'university 1',
  campus: [],
  timezone: 'Europe/Paris',
  admissionStart: new Date('01/01/2024'),
  admissionEnd: new Date('01/01/2025'),
  openServiceDate: new Date('01/01/2024'),
  closeServiceDate: endServiceDate,
  codes: [],
  domains: [],
  maxTandemsPerUser: 3,
  nativeLanguage: french,
});
const ll1 = new LearningLanguage({
  id: 'FR1-LL_EN_B2',
  language: french,
  learningType: LearningType.BOTH,
  level: ProficiencyLevel.B2,
  sameGender: false,
  sameAge: false,
});
const ll2 = new LearningLanguage({
  id: 'EN-LL_FR_A2',
  language: english,
  level: ProficiencyLevel.A2,
  learningType: LearningType.BOTH,
  sameGender: false,
  sameAge: false,
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
  learningLanguages: [ll2],
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
  nativeLanguage: english,
  masteredLanguages: [],
  testedLanguages: [],
  meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
  learningLanguages: [ll1],
  objectives: [],
  interests: [],
  biography: {
    superpower: faker.lorem.sentence(),
    favoritePlace: faker.lorem.sentence(),
    experience: faker.lorem.sentence(),
    anecdote: faker.lorem.sentence(),
  },
});

const tandem = new Tandem({
  id: 'tandem1',
  status: TandemStatus.ACTIVE,
  compatibilityScore: 89,
  learningLanguages: [ll1, ll2],
  learningType: LearningType.TANDEM,
});

describe('Cron', () => {
  const daysBeforeClosureNotification = 8;
  const instanceFactory = new InstanceFactory();
  const instance = instanceFactory.makeOne();

  const instanceRepository = new InMemoryInstanceRepository();
  const learningLanguageRepository = new InMemoryLearningLanguageRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const inMemoryEmail = new InMemoryEmailGateway();
  const inMemoryNotification = new InMemoryNotificaitonGateway();
  const inMemorySessionRepository = new InMemorySessionRepository();
  const inMemoryTandemRepository = new InMemoryTandemRepository();
  const cronService = new CronService(
    inMemoryEmail,
    instanceRepository,
    inMemoryNotification,
    universityRepository,
    learningLanguageRepository,
    inMemorySessionRepository,
    inMemoryTandemRepository,
  );

  beforeEach(() => {
    instanceRepository.init(instance);
    universityRepository.init([centralUniversity]);
    learningLanguageRepository.init([french1, english1], [tandem]);
    jest
      .spyOn(inMemoryEmail, 'sendTandemClosureNoticeEmail')
      .mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('processDailyNotifications', () => {
    it('should send notification on first day', async () => {
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() =>
          new Date(
            endServiceDate.getTime() -
              daysBeforeClosureNotification * 24 * 60 * 60 * 1000,
          ).getTime(),
        );
      await cronService.processDailyNotifications();
      expect(inMemoryEmail.sendTandemClosureNoticeEmail).toHaveBeenCalledTimes(
        2,
      );
    });

    it('should not send notification on second day', async () => {
      jest
        .spyOn(Date, 'now')
        .mockImplementation(() =>
          new Date(
            endServiceDate.getTime() -
              (daysBeforeClosureNotification - 1) * 24 * 60 * 60 * 1000,
          ).getTime(),
        );
      await cronService.processDailyNotifications();
      expect(inMemoryEmail.sendTandemClosureNoticeEmail).toHaveBeenCalledTimes(
        0,
      );
    });
  });

  it('should send notification a week later', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() =>
        new Date(
          endServiceDate.getTime() -
            (daysBeforeClosureNotification - 7) * 24 * 60 * 60 * 1000,
        ).getTime(),
      );
    await cronService.processDailyNotifications();
    expect(inMemoryEmail.sendTandemClosureNoticeEmail).toHaveBeenCalledTimes(2);
  });

  it('should not send notification after closure', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() =>
        new Date(endServiceDate.getTime() + 7 * 24 * 60 * 60 * 1000).getTime(),
      );
    await cronService.processDailyNotifications();
    expect(inMemoryEmail.sendTandemClosureNoticeEmail).toHaveBeenCalledTimes(0);
  });
});
