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
  CountryFactory,
  LanguageFactory,
  UniversityFactory,
} from '@app/common';
import { UuidProvider } from '../../../src/providers/services/uuid.provider';
import { InMemoryLanguageRepository } from '../../../src/providers/persistance/repositories/in-memory-language-repository';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { CreateUniversityUsecase } from '../../../src/core/usecases';
import { InMemoryCountryCodesRepository } from 'src/providers/persistance/repositories/in-memory-country-repository';
import { PairingMode } from 'src/core/models';

describe('CreateUniversity', () => {
  const languageFactory = new LanguageFactory();
  const countryFactory = new CountryFactory();
  const languages = languageFactory.makeMany(2);
  const countries = countryFactory.makeMany(2);

  const countryRepository = new InMemoryCountryCodesRepository();
  const universityRepository = new InMemoryUniversityRepository();
  const languageRepository = new InMemoryLanguageRepository();
  const uuidProvider = new UuidProvider();

  const createUniversityUsecase = new CreateUniversityUsecase(
    countryRepository,
    languageRepository,
    universityRepository,
    uuidProvider,
  );

  beforeEach(() => {
    universityRepository.reset();
    languageRepository.reset();
    countryRepository.init(countries);
    languageRepository.init(languages);
  });

  it('Should persist the new instance with the right data', async () => {
    await createUniversityUsecase.execute({
      name: 'Université de Lorraine',
      timezone: 'Europe/Paris',
      website: 'https://univ-lorraine.fr',
      admissionStart: new Date('2000-01-01'),
      admissionEnd: new Date('2000-12-31'),
      countryId: countries[0].id,
      campusNames: [],
      pairingMode: PairingMode.AUTOMATIC,
      openServiceDate: new Date('2000-01-01'),
      closeServiceDate: new Date('2000-12-31'),
      maxTandemsPerUser: 1,
      specificLanguagesAvailableIds: [],
      nativeLanguageId: 'languageId',
    });

    const instance = await universityRepository.ofName(
      'Université de Lorraine',
    );

    expect(instance).toBeDefined();
  });

  it('Should throw an error if the name already exists', async () => {
    let exception: Error | undefined;

    const factory = new UniversityFactory();
    const instance = factory.makeOne();

    universityRepository.init([instance]);

    try {
      await createUniversityUsecase.execute({
        name: instance.name,
        timezone: 'Europe/Paris',
        website: 'https://univ-lorraine.fr',
        countryId: countries[0].id,
        campusNames: [],
        admissionStart: new Date('2000-01-01'),
        admissionEnd: new Date('2000-12-31'),
        pairingMode: PairingMode.AUTOMATIC,
        openServiceDate: new Date('2000-01-01'),
        closeServiceDate: new Date('2000-12-31'),
        maxTandemsPerUser: 1,
        specificLanguagesAvailableIds: [],
        nativeLanguageId: 'languageId',
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });
});
