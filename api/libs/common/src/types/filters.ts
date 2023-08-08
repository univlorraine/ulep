export type StringFilter = {
  equals?: string;
  contains?: string;
};

export type SortOrderType<T extends keyof any> = {
  [key in T]: SortOrder;
};

export type SortOrder = 'asc' | 'desc';
