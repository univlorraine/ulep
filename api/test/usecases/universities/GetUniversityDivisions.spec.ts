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

import { UniversityFactory, UserFactory } from '@app/common';
import { InMemoryUniversityRepository } from '../../../src/providers/persistance/repositories/in-memory-university-repository';
import { GetUniversityDivisionsUsecase } from '../../../src/core/usecases';
import { InMemoryUserRepository } from 'src/providers/persistance/repositories/in-memory-user-repository';

describe('GetUniversityDivisions', () => {
  const universityRepository = new InMemoryUniversityRepository();
  const userRepository = new InMemoryUserRepository();

  const getUniversityDivisionsUsecase = new GetUniversityDivisionsUsecase(
    universityRepository,
    userRepository,
  );

  const universityFactory = new UniversityFactory();
  const university1 = universityFactory.makeOne();
  const university2 = universityFactory.makeOne();
  universityRepository.init([university1, university2]);

  const userFactory = new UserFactory();
  const user = userFactory.makeOne({
    university: university1,
    division: 'Division 1',
  });
  const user2 = userFactory.makeOne({
    university: university1,
    division: 'Division 2',
  });
  const user3 = userFactory.makeOne({
    university: university1,
    division: 'Division 2',
  });
  const user4 = userFactory.makeOne({
    university: university2,
    division: 'Division 3',
  });
  userRepository.init([user, user2, user3, user4]);

  it('Should throw an error if the university does not exist', async () => {
    let exception: Error | undefined;

    try {
      await getUniversityDivisionsUsecase.execute('123');
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });

  it('Should return the divisions of the university users only and without duplicates', async () => {
    const divisions = await getUniversityDivisionsUsecase.execute(
      university1.id,
    );

    const expectedDivisions = ['Division 1', 'Division 2'];

    expect(divisions).toEqual(expectedDivisions);
  });
});
