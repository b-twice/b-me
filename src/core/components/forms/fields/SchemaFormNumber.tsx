import React from "react";
import { TextField } from "@mui/material";
import { SchemaFieldProps } from "./SchemaField";
import { NumberFieldSchema } from "../SchemaForm";

export default function SchemaFormNumber({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<any, NumberFieldSchema>) {
  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange({
      [property]: value !== null && value !== undefined ? +value : value,
    });

  return (
    <TextField
      type="number"
      required={schema.required}
      error={!!error}
      id={property}
      label={schema.title}
      disabled={schema.disabled}
      value={obj[property] ?? ""}
      onChange={handleChange}
      helperText={schema.helperText}
      variant="filled"
    />
  );
}
