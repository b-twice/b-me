import { TableFilter } from "../tables/SchemaTable";
import { FormSchema, ListFormSchema } from "./SchemaForm";

export interface TableSchemaContextProps<T, F = TableFilter> {
  title: string;
  schema: FormSchema<T>;
  filter?: FormSchema<F>;
}

export interface ListSchemaContextProps<T> {
  title: string;
  schema: ListFormSchema<T>;
}
