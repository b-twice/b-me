import { FieldSchema, SelectFieldSchema } from "../SchemaForm";

function isSelectFieldSchema(schema: FieldSchema): schema is SelectFieldSchema {
  return schema.type === "select";
}

export { isSelectFieldSchema };
