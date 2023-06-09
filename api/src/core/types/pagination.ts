export enum SortPagination {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface Pagination {
  sort?: SortPagination;
  limit?: number;
  offset?: number;
}
