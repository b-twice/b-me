import { PaginatedResult } from "../../core/components/tables/SchemaTable";

export interface BaseTableClient<T, R = PaginatedResult<T>> {
  get: (id: number) => Promise<T>;
  getAll?: (size?: number) => Promise<T[]>;
  create: (o: T) => Promise<T>;
  update: (id: number, o: T) => Promise<T>;
  delete: (id: number) => Promise<void>;
  getPage: (
    sortName?: string | null | undefined,
    pageNumber?: number | undefined,
    pageSize?: number | undefined,
    ...rest: any[]
  ) => Promise<R>;
}

export interface BaseListClient<T> {
  create: (o: T) => Promise<T>;
  update: (id: number, o: T) => Promise<T>;
  delete: (id: number) => Promise<void>;
}
