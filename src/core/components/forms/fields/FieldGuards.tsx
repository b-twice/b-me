import {
  FieldSchema,
  RatingFieldSchema,
  SelectFieldSchema,
  TextFieldSchema,
} from "../SchemaForm";

function isSelectFieldSchema(schema: FieldSchema): schema is SelectFieldSchema {
  return schema.type === "select";
}

function isTextFieldSchema(schema: FieldSchema): schema is TextFieldSchema {
  return schema.type === "text";
}

function isRatingFieldSchema(schema: FieldSchema): schema is RatingFieldSchema {
  return schema.type === "rating";
}

export { isRatingFieldSchema, isTextFieldSchema, isSelectFieldSchema };
