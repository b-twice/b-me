import React from "react";
import { TextField } from "@mui/material";
import { SchemaFieldProps } from "./SchemaField";
import { DateFieldSchema } from "../SchemaForm";

export default function SchemaFormDate({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<any, DateFieldSchema>) {
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
      type="date"
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
