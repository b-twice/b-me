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
}: SchemaFieldProps<DateFieldSchema>) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ [property]: event.target.value });

  return (
    <TextField
      required={schema.required}
      error={!!error}
      helperText={schema.helperText}
      id={property}
      label={schema.title}
      value={obj[property] || ""}
      disabled={schema.disabled}
      onChange={handleChange}
      variant="filled"
      type="Date"
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
