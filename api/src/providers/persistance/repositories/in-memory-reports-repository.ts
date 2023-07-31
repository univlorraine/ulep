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
    return this.#reports.find((report) => report.id === id);
  }

  async categories(): Promise<ReportCategory[]> {
    return this.#categories;
  }

  async categoryOfId(id: string): Promise<ReportCategory> {
    return this.#categories.find((category) => category.id === id);
  }

  async updateReport(id: string, status: ReportStatus): Promise<void> {
    const index = this.#reports.findIndex((report) => report.id === id);

    if (index !== -1) {
      this.#reports[index].status = status;
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
