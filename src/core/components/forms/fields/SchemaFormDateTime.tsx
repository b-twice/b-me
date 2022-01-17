import React from "react";
import { TextField } from "@mui/material";
import { SchemaFieldProps } from "./SchemaField";
import { DateTimeFieldSchema } from "../SchemaForm";

export default function SchemaFormDateTime({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<any, DateTimeFieldSchema>) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ [property]: event.target.value });

  return (
    <TextField
      required={schema.required}
      error={!!error}
      helperText={error ?? schema.helperText}
      id={property}
      label={schema.title}
      value={obj[property] || ""}
      disabled={schema.disabled}
      onChange={handleChange}
      variant="filled"
      type="datetime-local"
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
