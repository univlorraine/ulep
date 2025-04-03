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

import { UserFactory } from '@app/common';
import { RessourceDoesNotExist } from '../../../src/core/errors';
import { CreateReportUsecase } from '../../../src/core/usecases';
import { InMemoryReportsRepository } from '../../../src/providers/persistance/repositories/in-memory-reports-repository';
import { InMemoryUserRepository } from '../../../src/providers/persistance/repositories/in-memory-user-repository';
import { UuidProvider } from 'src/providers/services/uuid.provider';

describe('CreateReport', () => {
  const userFactory = new UserFactory();
  const user = userFactory.makeOne();

  const reportsRepository = new InMemoryReportsRepository();
  const userRepositiry = new InMemoryUserRepository();
  const uuidProvider = new UuidProvider();
  const createReportsUsecase = new CreateReportUsecase(
    reportsRepository,
    userRepositiry,
    uuidProvider,
  );

  beforeEach(() => {
    reportsRepository.reset();
    userRepositiry.reset();
  });

  it('Should persist the new Report with the right data', async () => {
    const user = userFactory.makeOne();
    userRepositiry.init([user]);

    reportsRepository.createCategory({
      id: '1',
      name: { id: 'uuid', content: 'category', language: 'en' },
    });

    await createReportsUsecase.execute({
      owner: user.id,
      content: 'content',
      category: '1',
    });

    const report = await reportsRepository.reportOfId('1');

    expect(report).toBeDefined();
  });

  it('Should throw an error if the category does not exists', async () => {
    try {
      await createReportsUsecase.execute({
        content: 'content',
        category: 'uuid_does_not_exists',
        owner: user.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(RessourceDoesNotExist);
    }
  });

  it('Should throw an error if the user does not exists', async () => {
    let exception: Error | undefined;

    reportsRepository.createCategory({
      id: '1',
      name: { id: 'uuid', content: 'category', language: 'en' },
    });

    try {
      await createReportsUsecase.execute({
        content: 'content',
        category: '1',
        owner: 'uuid_does_not_exists',
      });
    } catch (error) {
      exception = error;
    }

    expect(exception).toBeDefined();
  });
});
