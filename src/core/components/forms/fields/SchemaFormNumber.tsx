import React from "react";
import { TextField } from "@material-ui/core";
import { SchemaFieldProps } from "./SchemaField";
import { NumberFieldSchema } from "../SchemaForm";

export default function SchemaFormNumber({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<NumberFieldSchema>) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ [property]: event.target.value });
  return (
    <TextField
      type="number"
      required={schema.required}
      error={!!error}
      id={property}
      label={schema.title}
      disabled={schema.disabled}
      value={obj[property] || ""}
      onChange={handleChange}
      helperText={schema.helperText}
      variant="filled"
    />
  );
}
