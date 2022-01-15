import React from "react";
import { SchemaFieldProps } from "./SchemaField";
import { SelectFieldSchema, MultiSelectFieldSchema } from "../SchemaForm";
import FormMultiSelect from "./FormMultiSelect";

export default function SchemaFormMultiSelect({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<any, SelectFieldSchema | MultiSelectFieldSchema>) {
  const handleChange = (values: any[]) => onChange({ [property]: values });
  return (
    <FormMultiSelect
      label={schema.title}
      error={error}
      required={schema.required || false}
      id={property}
      helperText={schema.helperText}
      disabled={schema.disabled}
      options={schema.options}
      items={obj[property]}
      valueProperty="id"
      onChange={handleChange}
    />
  );
}
