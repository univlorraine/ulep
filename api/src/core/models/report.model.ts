import { User } from 'src/core/models/user.model';
import { TextContent } from './translation.model';

export enum ReportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export type CreateReportCategoryProps = {
  id: string;
  name: TextContent;
};

export class ReportCategory {
  readonly id: string;

  readonly name: TextContent;

  constructor(props: CreateReportCategoryProps) {
    this.id = props.id;
    this.name = props.name;
  }
}

export type CreateReportProps = {
  id: string;
  category: ReportCategory;
  status: ReportStatus;
  content: string;
  user?: User;
  createdAt?: Date;
  comment?: string;
};

export const UNSUBSCRIBE_CATEGORY_REPORT = 'Désinscription';

export class Report {
  readonly id: string;

  readonly category: ReportCategory;

  readonly status: ReportStatus;

  readonly content: string;

  readonly user?: User;

  readonly createdAt?: Date;

  readonly comment?: string;

  constructor(props: CreateReportProps) {
    this.id = props.id;
    this.category = props.category;
    this.status = props.status;
    this.content = props.content;
    this.user = props.user;
    this.createdAt = props.createdAt;
    this.comment = props.comment;
  }

  static create(props: CreateReportProps): Report {
    return new Report({ ...props });
  }
}
