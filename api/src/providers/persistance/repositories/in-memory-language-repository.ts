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

import { Collection } from '@app/common';
import {
  Language,
  LanguageStatus,
  SuggestedLanguage,
} from 'src/core/models/language.model';

import { LanguageRepository } from 'src/core/ports/language.repository';

export class InMemoryLanguageRepository implements LanguageRepository {
  #languages: Language[] = [];
  #requests: SuggestedLanguage[] = [];

  init(languages: Language[]): void {
    this.#languages = languages;
  }

  reset(): void {
    this.#languages = [];
  }

  create(language: Language): Promise<Language> {
    this.#languages.push(language);

    return Promise.resolve(language);
  }

  ofId(languageId: string): Promise<Language> {
    return Promise.resolve(
      this.#languages.find((language) => language.id === languageId),
    );
  }

  async ofCode(code: string): Promise<Language> {
    return this.#languages.find((language) => language.code === code);
  }

  async all(): Promise<Collection<Language>> {
    return new Collection<Language>({
      items: this.#languages,
      totalItems: this.#languages.length,
    });
  }

  async allRequests(
    offset?: number,
    limit?: number,
  ): Promise<Collection<SuggestedLanguage>> {
    const allItems = Array.from(this.#requests.values());

    return {
      items: allItems.slice(offset, offset + limit),
      totalItems: allItems.length,
    };
  }

  countAllRequests(
    offset?: number,
    limit?: number,
  ): Promise<Collection<{ language: Language; count: number }>> {
    const languageCounts: {
      [key: string]: { language: Language; count: number };
    } = this.#requests.reduce((acc, request) => {
      const languageCode = request.language.code;
      if (!acc[languageCode]) {
        acc[languageCode] = { language: request.language, count: 0 };
      }
      acc[languageCode].count += 1;
      return acc;
    }, {});

    const sortedLanguages = Object.values(languageCounts).sort(
      (a, b) => b.count - a.count,
    );

    const paginatedResults = sortedLanguages.slice(offset, offset + limit);

    return Promise.resolve(
      new Collection<{ language: Language; count: number }>({
        items: paginatedResults,
        totalItems: sortedLanguages.length,
      }),
    );
  }

  remove(language: Language): Promise<void> {
    this.#languages = this.#languages.filter((l) => l.id !== language.id);

    return Promise.resolve();
  }

  async addRequest(code: string, user: string): Promise<void> {
    this.#requests[code] = [...(this.#requests[code] || []), user];
  }

  async countRequests(code: string): Promise<number> {
    return this.#requests[code]?.length || 0;
  }

  update(language: Language): Promise<Language> {
    const index = this.#languages.findIndex((obj) => obj.id === language.id);

    if (index === -1) {
      return Promise.reject(null);
    }

    this.#languages[index] = language;

    return Promise.resolve(language);
  }

  getLanguagesProposedToLearning(): Promise<Language[]> {
    const res = this.#languages.filter(
      (language) =>
        language.mainUniversityStatus === LanguageStatus.PRIMARY ||
        language.mainUniversityStatus === LanguageStatus.SECONDARY,
    );
    return Promise.resolve(res);
  }

  getLanguagesSuggestedByUser(): Promise<SuggestedLanguage[]> {
    throw new Error('Not implemented');
  }

  deleteAllRequestFromLanguage(code: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
