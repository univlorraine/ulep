import { Report, ReportCategory, ReportStatus } from '../models';

export const REPORT_REPOSITORY = 'report.repository';

export interface ReportRepository {
  createReport(report: Report): Promise<Report>;

  createCategory(category: ReportCategory): Promise<ReportCategory>;

  reportsByStatus(status: ReportStatus): Promise<Report[]>;

  reportOfId(id: string): Promise<Report | null>;

  categories(): Promise<ReportCategory[]>;

  categoryOfId(id: string): Promise<ReportCategory | null>;

  updateReport(id: string, status: ReportStatus): Promise<void>;

  deleteReport(instance: Report): Promise<void>;

  deleteCategory(instance: ReportCategory): Promise<void>;
}
