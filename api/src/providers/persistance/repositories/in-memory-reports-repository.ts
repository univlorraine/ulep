import { Collection } from '@app/common';
import { Report, ReportCategory, ReportStatus } from 'src/core/models';
import { ReportRepository } from 'src/core/ports/report.repository';

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

  async updateReport(id: string, status: ReportStatus): Promise<void> {
    const index = this.#reports.findIndex((report) => report.id === id);

    if (index !== -1) {
      const report = this.#reports[index];
      this.#reports[index] = { ...report, status };
    }
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

  async deleteReport(instance: Report): Promise<void> {
    const index = this.#reports.findIndex(
      (report) => report.id === instance.id,
    );

    if (index !== -1) {
      this.#reports.splice(index, 1);
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
}
