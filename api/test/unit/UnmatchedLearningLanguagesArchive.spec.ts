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

import { toUnmatchedLearningLanguageRows } from 'src/providers/persistance/mappers/historizedUnmatchedLearningLanguage.mapper';

const PURGE_ID = 'purge-2026';

const learningLanguage = (id: string, userId: string, languageId: string) => ({
  id,
  language: { id: languageId },
  profile: { user: { id: userId } },
});

describe('toUnmatchedLearningLanguageRows', () => {
  it('maps every learning language to an archive row', () => {
    const rows = toUnmatchedLearningLanguageRows(
      [
        learningLanguage('ll-1', 'user-1', 'lang-en'),
        learningLanguage('ll-2', 'user-2', 'lang-de'),
      ],
      PURGE_ID,
    );

    expect(rows).toEqual([
      {
        id: 'll-1',
        user_id: 'user-1',
        purge_id: PURGE_ID,
        language_code_id: 'lang-en',
      },
      {
        id: 'll-2',
        user_id: 'user-2',
        purge_id: PURGE_ID,
        language_code_id: 'lang-de',
      },
    ]);
  });

  // ULEP-57: a user may register several learning languages for the same
  // language (ETANDEM and TANDEM for instance). The archive table is unique on
  // (user_id, language_code_id), so those must collapse into a single row.
  it('keeps a single row when a user has several learning languages for the same language', () => {
    const rows = toUnmatchedLearningLanguageRows(
      [
        learningLanguage('ll-1', 'user-1', 'lang-en'),
        learningLanguage('ll-2', 'user-1', 'lang-en'),
        learningLanguage('ll-3', 'user-1', 'lang-de'),
      ],
      PURGE_ID,
    );

    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.id)).toEqual(['ll-1', 'll-3']);
  });

  it('does not collapse the same language across different users', () => {
    const rows = toUnmatchedLearningLanguageRows(
      [
        learningLanguage('ll-1', 'user-1', 'lang-en'),
        learningLanguage('ll-2', 'user-2', 'lang-en'),
      ],
      PURGE_ID,
    );

    expect(rows).toHaveLength(2);
  });

  it('returns no row for an empty archive', () => {
    expect(toUnmatchedLearningLanguageRows([], PURGE_ID)).toEqual([]);
  });
});
