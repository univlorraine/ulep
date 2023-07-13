import { User } from './user';

export type CreateReportProps = {
  id: string;
  owner: User;
  category: ReportCategory;
  content: string;
};

export type ReportCategory = {
  id: string;
  name: string;
};

export class Report {
  #id: string;

  #owner: User;

  #category: ReportCategory;

  #content: string;

  constructor(props: CreateReportProps) {
    this.#id = props.id;
    this.#owner = props.owner;
    this.#content = props.content;
    this.#category = props.category;
  }

  static create(props: CreateReportProps): Report {
    return new Report({ ...props });
  }

  get id(): string {
    return this.#id;
  }

  get owner(): User {
    return this.#owner;
  }

  get category(): ReportCategory {
    return this.#category;
  }

  get content(): string {
    return this.#content;
  }
}
