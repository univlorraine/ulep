import { StringFilter } from 'src/shared/types/filters';
import { Collection } from '../../shared/types/collection';
import { Report, ReportCategory } from '../models/report';

export interface ReportRepository {
  ofId(id: string): Promise<Report | null>;

  where(
    offset?: number,
    limit?: number,
    category?: { name: StringFilter },
  ): Promise<Collection<Report>>;

  save(report: Report): Promise<void>;

  delete(id: string): Promise<void>;

  categories(): Promise<ReportCategory[]>;

  categoryOfId(id: string): Promise<ReportCategory | null>;

  categoryOfName(name: string): Promise<ReportCategory | null>;

  createCategory(name: string): Promise<string>;

  deleteCategory(id: string): Promise<void>;
}
