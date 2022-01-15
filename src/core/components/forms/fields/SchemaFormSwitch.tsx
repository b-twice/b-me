import React from "react";
import { Switch, FormControlLabel } from "@mui/material";
import { SchemaFieldProps } from "./SchemaField";
import { SwitchFieldSchema } from "../SchemaForm";

export default function SchemaFormSwitch({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<any, SwitchFieldSchema>) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [property]: event.target.checked ? 1 : 0 });
  };
  return (
    <FormControlLabel
      control={
        <Switch
          checked={obj[property] === 1 ? true : false}
          color="secondary"
          required={schema.required}
          disabled={schema.disabled}
          id={property}
          onChange={handleChange}
        />
      }
      label={schema.title}
    />
  );
}
