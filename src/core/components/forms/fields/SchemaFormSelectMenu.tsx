import React from "react";
import { SchemaFieldProps } from "./SchemaField";
import { SelectMenuFieldSchema } from "../SchemaForm";
import FormSelectMenu from "./FormSelectMenu";

export default function SchemaFormSelectMenu({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<any, SelectMenuFieldSchema>) {
  const handleChange = (selectObj: any) => onChange({ [property]: selectObj });
  return (
    <FormSelectMenu
      label={schema.title}
      error={error}
      required={schema.required || false}
      id={property}
      options={schema.options}
      disabled={schema.disabled}
      obj={obj[property]}
      valueProperty="id"
      labelProperty="name"
      onChange={handleChange}
    />
  );
}
