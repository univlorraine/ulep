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
import { InMemoryProfileRepository } from '../../../src/providers/persistance/repositories/in-memory-profile-repository';
import { GetProfileUsecase } from '../../../src/core/usecases/profiles/get-profile.usecase';
import {
  AvailabilitesOptions,
  LearningLanguage,
  LearningType,
  MeetingFrequency,
  ProficiencyLevel,
  Profile,
} from 'src/core/models';

describe('GetProfile', () => {
  const userFactory = new UserFactory();
  const universityFactory = new UniversityFactory();
  const languageFactory = new LanguageFactory();
  const interestFactory = new InterestFactory();

  const profileRepository = new InMemoryProfileRepository();
  const getProfileUsecase = new GetProfileUsecase(profileRepository);

  const learningLanguage = languageFactory.makeOne({
    id: 'uuid-1',
    code: 'en',
  });

  const nativeLanguage = languageFactory.makeOne({
    id: 'uuid-2',
    code: 'fr',
  });

  const university = universityFactory.makeOne();

  const user = userFactory.makeOne({ university });

  const interest = interestFactory.makeOne();

  const profile = new Profile({
    id: 'uuid-1',
    user: user,
    nativeLanguage: nativeLanguage,
    masteredLanguages: [],
    testedLanguages: [],
    learningLanguages: [
      new LearningLanguage({
        id: 'learning-language-uuid-1',
        language: learningLanguage,
        level: ProficiencyLevel.B2,
        learningType: LearningType.ETANDEM,
        sameGender: false,
        sameAge: false,
      }),
    ],
    meetingFrequency: MeetingFrequency.ONCE_A_WEEK,
    objectives: [],
    interests: [interest],
    availabilities: {
      monday: AvailabilitesOptions.AVAILABLE,
      tuesday: AvailabilitesOptions.AVAILABLE,
      wednesday: AvailabilitesOptions.AVAILABLE,
      thursday: AvailabilitesOptions.AVAILABLE,
      friday: AvailabilitesOptions.AVAILABLE,
      saturday: AvailabilitesOptions.AVAILABLE,
      sunday: AvailabilitesOptions.AVAILABLE,
    },
  });

  beforeEach(() => {
    profileRepository.reset();
  });

  it('should get a profile', async () => {
    profileRepository.init([profile]);

    const instance = await getProfileUsecase.execute({
      id: profile.id,
    });

    expect(instance).toBeDefined();
  });

  it('should throw an error if profile does not exist', async () => {
    let exception: Error | undefined;

    try {
      await getProfileUsecase.execute({
        id: 'uuid-that-does-not-exist',
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });
});
