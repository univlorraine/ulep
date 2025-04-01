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
import { Report, ReportCategory, ReportStatus } from 'src/core/models';
import {
  ReportQueryWhere,
  ReportRepository,
} from 'src/core/ports/report.repository';

export class InMemoryReportsRepository implements ReportRepository {
  #categories: ReportCategory[] = [];
  #reports: Report[] = [];

  init(categories: ReportCategory[], reports: Report[]): void {
    this.#categories = categories;
    this.#reports = reports;
  }

  reset(): void {
    this.#categories = [];
    this.#reports = [];
  }

  async all(offset: number, limit: number): Promise<Collection<Report>> {
    const allItems = Array.from(this.#reports.values());

    return {
      items: allItems.slice(offset, offset + limit),
      totalItems: allItems.length,
    };
  }

  async createReport(report: Report): Promise<Report> {
    this.#reports.push(report);

    return report;
  }

  async createCategory(category: ReportCategory): Promise<ReportCategory> {
    this.#categories.push(category);

    return category;
  }

  async hasActiveReport(categoryId: string): Promise<boolean> {
    const activeReports = this.#reports.filter(
      (report) =>
        report.category.id === categoryId &&
        (report.status === 'OPEN' || report.status === 'IN_PROGRESS'),
    );

    return activeReports.length > 0;
  }

  async findReportByUserIdAndCategory(
    userId: string,
    categoryId: any,
  ): Promise<Report | null> {
    const report = await this.#reports.find(
      (report) =>
        report.user.id === userId && report.category.id === categoryId,
    );

    if (!report) {
      return null;
    }

    return report;
  }

  async reportsByStatus(status: ReportStatus): Promise<Report[]> {
    return this.#reports.filter((report) => report.status === status);
  }

  async findReportsByUser(userId: string): Promise<Report[]> {
    const filteredReports = this.#reports.filter(
      (report) => report.user.id === userId,
    );
    return filteredReports;
  }

  async reportOfId(id: string): Promise<Report> {
    const index = this.#reports.findIndex((report) => report.id === id);

    if (index !== -1) {
      return this.#reports[index];
    }

    return null;
  }

  async categories(): Promise<Collection<ReportCategory>> {
    return new Collection<ReportCategory>({
      items: this.#categories,
      totalItems: this.#categories.length,
    });
  }

  async categoryOfId(id: string): Promise<ReportCategory> {
    const index = this.#categories.findIndex((category) => category.id === id);

    if (index !== -1) {
      return this.#categories[index];
    }

    return null;
  }

  categoryOfName(name: string): Promise<ReportCategory> {
    return Promise.resolve(
      this.#categories.find((category) => category.name.content === name),
    );
  }

  async updateReport(id: string, status: ReportStatus): Promise<Report> {
    const index = this.#reports.findIndex((report) => report.id === id);

    if (index !== -1) {
      const report = this.#reports[index];
      this.#reports[index] = { ...report, status };
    }

    return this.reportOfId(id);
  }

  async updateCategoryReport(
    category: ReportCategory,
  ): Promise<ReportCategory> {
    const index = this.#categories.findIndex((obj) => obj.id === category.id);

    if (index === -1) {
      return Promise.reject(null);
    }

    this.#categories[index] = category;

    return Promise.resolve(category);
  }

  async deleteReport(where: ReportQueryWhere): Promise<void> {
    if (where.id) {
      const index = this.#reports.findIndex((report) => report.id === where.id);

      if (index !== -1) {
        this.#reports.splice(index, 1);
      }
    }

    if (where.status) {
      this.#reports = this.#reports.filter(
        (report) => report.status !== where.status,
      );
    }
  }

  async deleteCategory(instance: ReportCategory): Promise<void> {
    const index = this.#categories.findIndex(
      (category) => category.id === instance.id,
    );

    if (index !== -1) {
      this.#categories.splice(index, 1);
    }
  }

  async deleteManyReports(where: ReportQueryWhere): Promise<void> {
    if (where.status) {
      this.#reports = this.#reports.filter(
        (report) => report.status !== where.status,
      );
    }

    if (where.id) {
      this.#reports = this.#reports.filter((report) => report.id !== where.id);
    }

    if (where.universityId) {
      this.#reports = this.#reports.filter(
        (report) => report.user.university.id !== where.universityId,
      );
    }
  }
}
