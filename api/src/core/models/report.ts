export type CreateReportProps = {
  id: string;
  ownerId: string;
  category: ReportCategory;
  content: string;
};

export type ReportCategory = {
  id: string;
  name: string;
};

export class Report {
  #id: string;

  #ownerId: string;

  #category: ReportCategory;

  #content: string;

  constructor(props: CreateReportProps) {
    this.#id = props.id;
    this.#ownerId = props.ownerId;
    this.#content = props.content;
    this.#category = props.category;
  }

  static create(props: CreateReportProps): Report {
    return new Report({ ...props });
  }

  get id(): string {
    return this.#id;
  }

  get ownerId(): string {
    return this.#ownerId;
  }

  get category(): ReportCategory {
    return this.#category;
  }

  get content(): string {
    return this.#content;
  }
}
