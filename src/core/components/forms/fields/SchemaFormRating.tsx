import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { SchemaFieldProps } from "./SchemaField";
import { RatingFieldSchema } from "../SchemaForm";
import FormRating from "./FormRating";
import AppIcon from "../../icons/AppIcon";

export default function SchemaFormRating({
  property,
  schema,
  obj,
  onChange,
  error,
}: SchemaFieldProps<any, RatingFieldSchema>) {
  const handleChange = (event: any, value: number | null) => {
    setValue(value);
    onChange({ [property]: value });
  };
  const [value, setValue] = useState<any>(null);
  useEffect(() => {
    setValue(obj[property] ?? null);
  }, [obj, property]);

  return (
    <div>
      <Typography component="legend">{schema.title}</Typography>
      <FormRating
        schema={schema}
        id={property}
        name={property}
        max={schema.max}
        disabled={schema.disabled}
        icon={<AppIcon fontSize="inherit" type={schema.icon} />}
        emptyIcon={
          <AppIcon fontSize="inherit" type={`${schema.icon}_border`} />
        }
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
