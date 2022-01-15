import React from "react";
import { SchemaFieldProps } from "./SchemaField";
import FormSelect from "./FormSelect";
import { SelectFieldSchema, MultiSelectFieldSchema } from "../SchemaForm";

export default function SchemaFormSelect({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<any, SelectFieldSchema | MultiSelectFieldSchema>) {
  const handleChange = (value: any) => onChange({ [property]: value });
  return (
    <FormSelect
      label={schema.title}
      error={error}
      required={schema.required || false}
      id={property}
      options={schema.options}
      helperText={schema.helperText}
      value={obj[property]}
      disabled={schema.disabled}
      valueProperty="id"
      onChange={handleChange}
    />
  );
}
