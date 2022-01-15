import { FieldConstructor, FormSchema } from "../SchemaForm";
import { AppLookup } from "../../../../common/client";
import { BaseTableClient } from "../../../../common/client/BaseClient";
import { TableSchemaContextProps } from "../EditSchemaContextProps.interface";

export function CreateLookupSchemaContextProps<T extends AppLookup>(
  title: string,
  api: BaseTableClient<T>
): TableSchemaContextProps<T> {
  return {
    title,
    schema: {
      properties: {
        name: FieldConstructor.text({
          title: "Name",
          required: true,
        }),
      },
      create: (o: T) => api.create(o),
      update: (o: T) => api.update(o.id, o),
      delete: (o: T) => api.delete(o.id),
    } as FormSchema<T>,
    filter: {
      properties: {
        name: FieldConstructor.text({
          title: "Name",
        }),
      },
    },
  };
}
