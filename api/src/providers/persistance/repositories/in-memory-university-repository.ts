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
import { Injectable } from '@nestjs/common';
import { University } from 'src/core/models/university.model';
import {
  UniversityRepository,
  UpdateUniversityResponse,
} from 'src/core/ports/university.repository';

@Injectable()
export class InMemoryUniversityRepository implements UniversityRepository {
  #universities: University[] = [];

  get universities(): University[] {
    return this.#universities;
  }

  init(universities: University[]): void {
    this.#universities = universities;
  }

  reset(): void {
    this.#universities = [];
  }

  async create(university: University): Promise<University> {
    this.#universities.push(university);

    return university;
  }

  async findAll(): Promise<Collection<University>> {
    return new Collection<University>({
      items: this.#universities,
      totalItems: this.#universities.length,
    });
  }

  async findUniversityCentral(): Promise<University> {
    return this.#universities.find((university) => !university.parent);
  }

  async havePartners(id: string): Promise<boolean> {
    return this.#universities.some((university) => university.parent === id);
  }

  async ofId(id: string): Promise<University> {
    return this.#universities.find((university) => university.id === id);
  }

  async ofName(name: string): Promise<University> {
    return this.#universities.find((university) => university.name === name);
  }

  async update(university: University): Promise<UpdateUniversityResponse> {
    const index = this.#universities.findIndex((u) => u.id === university.id);

    if (index !== -1) {
      const university = this.#universities[index];
      this.#universities[index] = university;
    }
    return { university, usersId: [] };
  }

  async remove(id: string): Promise<void> {
    const index = this.#universities.findIndex((u) => u.id === id);

    if (index !== -1) {
      this.#universities.splice(index, 1);
    }
  }
}
