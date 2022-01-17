import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { SchemaFieldProps } from "./SchemaField";
import { CurrencyFieldSchema } from "../SchemaForm";

export default function SchemaFormCurrency({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<any, CurrencyFieldSchema>) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ [property]: +event.target.value });
  return (
    <TextField
      required={schema.required}
      error={!!error}
      helperText={error ?? schema.helperText}
      id={property}
      label={schema.title}
      value={obj[property] ?? ""}
      onChange={handleChange}
      disabled={schema.disabled}
      variant="filled"
      type="number"
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
    />
  );
}
