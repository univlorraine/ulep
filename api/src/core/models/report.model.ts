import { TextContent } from './translation.model';

export enum ReportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export interface ReportCategory {
  id: string;
  name: TextContent;
}

export type CreateReportProps = {
  id: string;
  owner: string;
  category: ReportCategory;
  status: ReportStatus;
  content: string;
};

export class Report {
  #id: string;

  #owner: string;

  #category: ReportCategory;

  #status: ReportStatus;

  #content: string;

  constructor(props: CreateReportProps) {
    this.#id = props.id;
    this.#owner = props.owner;
    this.#category = props.category;
    this.#status = props.status;
    this.#content = props.content;
  }

  static create(props: CreateReportProps): Report {
    return new Report({ ...props });
  }

  get id(): string {
    return this.#id;
  }

  get owner(): string {
    return this.#owner;
  }

  get category(): ReportCategory {
    return this.#category;
  }

  set status(status: ReportStatus) {
    this.#status = status;
  }

  get status(): ReportStatus {
    return this.#status;
  }

  get content(): string {
    return this.#content;
  }
}
