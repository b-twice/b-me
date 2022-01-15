import {
  BaseTableClient,
  BaseListClient,
} from "../../../common/client/BaseClient";
import { PaginatedResult, TableFilter } from "../tables/SchemaTable";
import {
  ListSchemaContextProps,
  TableSchemaContextProps,
} from "./EditSchemaContextProps.interface";
import { FormSchema, ListFormSchema } from "./SchemaForm";

interface TableProps<T, F, R = PaginatedResult<T>> {
  title: string;
  api: BaseTableClient<T, R>;
  schema: FormSchema<T>;
  filter?: FormSchema<F>;
}

export function CreateBaseSchemaContextProps<
  T,
  F = TableFilter,
  R = PaginatedResult<T>
>({
  title,
  api,
  schema,
  filter,
}: TableProps<T, F, R>): TableSchemaContextProps<T, F> {
  return {
    title,
    schema: {
      ...schema,
      create: (o: T) => (schema.create ? schema.create(o) : api.create(o)),
      update: (o: T) =>
        schema.update ? schema.update(o) : api.update((o as any).id, o),
      delete: (o: T) =>
        schema.delete ? schema.delete(o) : api.delete((o as any).id),
    },
    filter,
  };
}

interface ListProps<T> {
  title: string;
  api: BaseListClient<T>;
  schema: ListFormSchema<T>;
}

export function CreateBaseListSchemaContextProps<T>({
  title,
  api,
  schema,
}: ListProps<T>): ListSchemaContextProps<T> {
  return {
    title,
    schema: {
      ...schema,
      display: (o: T) =>
        schema.display ? schema.display(o) : ({ ...o } as any),
      create: (o: T) => (schema.create ? schema.create(o) : api.create(o)),
      update: (o: T) =>
        schema.update ? schema.update(o) : api.update((o as any).id, o),
      delete: (o: T) =>
        schema.delete ? schema.delete(o) : api.delete((o as any).id),
    },
  };
}
