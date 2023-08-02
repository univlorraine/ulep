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
  owner: string;
  category: ReportCategory;
  status: ReportStatus;
  content: string;
};

export class Report {
  readonly id: string;

  readonly owner: string;

  readonly category: ReportCategory;

  readonly status: ReportStatus;

  readonly content: string;

  constructor(props: CreateReportProps) {
    this.id = props.id;
    this.owner = props.owner;
    this.category = props.category;
    this.status = props.status;
    this.content = props.content;
  }

  static create(props: CreateReportProps): Report {
    return new Report({ ...props });
  }
}
