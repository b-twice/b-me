import React from "react";
import { TextField } from "@mui/material";
import { SchemaFieldProps } from "./SchemaField";
import { TextFieldSchema } from "../SchemaForm";

export default function SchemaFormText({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<TextFieldSchema>) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ [property]: event.target.value });
  return (
    <TextField
      required={schema.required}
      error={!!error}
      id={property}
      label={schema.title}
      value={obj[property] || ""}
      onChange={handleChange}
      helperText={schema.helperText}
      disabled={schema.disabled}
      variant="filled"
    />
  );
}
