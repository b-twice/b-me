import React, { useState, useEffect } from "react";
import FormOption from "../FormOptionType";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface MultiSelectProps {
  label: string;
  id: string;
  options: FormOption[];
  items: any[] | undefined;
  valueProperty: string;
  required: boolean;
  error: string;
  helperText?: string;
  disabled?: boolean;
  onChange(values: any[]): void;
}

export default function FormMultiSelect({
  label,
  id,
  options,
  items,
  valueProperty,
  required,
  onChange,
  error,
  disabled,
  helperText,
}: MultiSelectProps) {
  const [values, setValues] = useState<FormOption[] | undefined>([]);

  useEffect(() => {
    if (items !== undefined) {
      setValues(options.filter((o) => items.find((item) => item === o.value)));
    }
  }, [items, valueProperty, options]);

  function handleChange(event: unknown, selected: FormOption[]): void {
    const values = selected.map((item) => item.value);
    onChange(values);
  }

  const isEqual = (option: FormOption, selected: FormOption) => {
    return option?.value === selected?.value;
  };

  return (
    <Autocomplete
      multiple
      id={id}
      disabled={disabled}
      options={options}
      placeholder={label}
      onChange={handleChange}
      value={values}
      isOptionEqualToValue={isEqual}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="filled"
          error={!!error}
          helperText={error ?? helperText}
          required={required}
        />
      )}
    />
  );
}
