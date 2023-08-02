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

  async createReport(report: Report): Promise<Report> {
    this.#reports.push(report);

    return report;
  }

  async createCategory(category: ReportCategory): Promise<ReportCategory> {
    this.#categories.push(category);

    return category;
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

  async categories(): Promise<ReportCategory[]> {
    return this.#categories;
  }

  async categoryOfId(id: string): Promise<ReportCategory> {
    const index = this.#categories.findIndex((category) => category.id === id);

    if (index !== -1) {
      return this.#categories[index];
    }

    return null;
  }

  async updateReport(id: string, status: ReportStatus): Promise<void> {
    const index = this.#reports.findIndex((report) => report.id === id);

    if (index !== -1) {
      const report = this.#reports[index];
      this.#reports[index] = { ...report, status };
    }
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
