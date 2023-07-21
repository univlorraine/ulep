import { Report, ReportCategory } from '../../..//core/models/report';
import { Collection } from '../../..//shared/types/collection';
import { StringFilter } from '../../..//shared/types/filters';
import { ReportRepository } from '../../../core/ports/report.repository';

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

  async ofId(id: string): Promise<Report> {
    return this.#reports.find((report) => report.id === id);
  }

  async where(
    offset?: number,
    limit?: number,
    category?: { name: StringFilter },
  ): Promise<Collection<Report>> {
    const reports = this.#reports.filter((report) => {
      if (category) {
        return report.category.name === category.name;
      }

      return true;
    });

    return {
      items: reports.slice(offset, offset + limit),
      totalItems: reports.length,
    };
  }

  async save(report: Report): Promise<void> {
    this.#reports.push(report);
  }

  async delete(id: string): Promise<void> {
    const index = this.#reports.findIndex((report) => report.id === id);

    if (index !== -1) {
      this.#reports.splice(index, 1);
    }
  }

  async categories(): Promise<ReportCategory[]> {
    return this.#categories;
  }

  async categoryOfId(id: string): Promise<ReportCategory | null> {
    const category = this.#categories.find((category) => category.id === id);

    return category;
  }

  async categoryOfName(name: string): Promise<ReportCategory> {
    const category = this.#categories.find(
      (category) => category.name === name,
    );

    return category;
  }

  async createCategory(name: string): Promise<string> {
    const id = Math.random().toString();

    this.#categories.push({ id, name });

    return id;
  }

  async deleteCategory(id: string): Promise<void> {
    const index = this.#categories.findIndex((category) => category.id === id);

    if (index !== -1) {
      this.#categories.splice(index, 1);
    }
  }
}
