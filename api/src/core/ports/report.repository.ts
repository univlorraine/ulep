import { Collection, SortOrder, StringFilter } from '@app/common';
import { Report, ReportCategory, ReportStatus } from '../models';

export const REPORT_REPOSITORY = 'report.repository';

export type ReportQuerySortKey = 'firstname' | 'lastname' | 'university';
export interface ReportQueryWhere {
  status?: StringFilter;
}

export interface ReportQueryOrderBy {
  field?: ReportQuerySortKey;
  order: SortOrder;
}

export interface ReportRepository {
  all(
    offset?: number,
    limit?: number,
    orderBy?: ReportQueryOrderBy,
    where?: ReportQueryWhere,
  ): Promise<Collection<Report>>;

  createReport(report: Report): Promise<Report>;

  createCategory(category: ReportCategory): Promise<ReportCategory>;

  reportOfId(id: string): Promise<Report | null>;

  categories(): Promise<Collection<ReportCategory>>;

  categoryOfId(id: string): Promise<ReportCategory | null>;

  categoryOfName(name: string): Promise<ReportCategory | null>;

  updateReport(id: string, status: ReportStatus): Promise<void>;

  deleteReport(instance: Report): Promise<void>;

  deleteCategory(instance: ReportCategory): Promise<void>;
}
