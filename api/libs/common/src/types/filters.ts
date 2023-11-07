export enum ModeQuery {
  INSENSITIVE = 'insensitive',
  DEFAULT = 'default',
}

export type StringFilter = {
  equals?: string;
  contains?: string;
  mode?: ModeQuery;
};

export type SortOrder = 'asc' | 'desc';
