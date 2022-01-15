import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormOption from "../FormOptionType";
import Autocomplete from "@mui/material/Autocomplete";

interface SelectProps {
  label: string;
  id: string;
  options: FormOption[];
  value: number | string | undefined;
  valueProperty: string;
  required: boolean;
  error: string;
  helperText?: string;
  disabled?: boolean;
  onChange(value: any): void;
}

export default function FormSelect({
  label,
  id,
  options,
  value,
  valueProperty,
  required,
  onChange,
  error,
  helperText,
  disabled,
}: SelectProps) {
  const [option, setOption] = useState<FormOption | null>(null);
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setOption(options.find((o) => o.value === value) ?? null);
    } else {
      setOption(null);
    }
  }, [value, valueProperty, options]);

  function handleChange(
    selectionEvent: unknown,
    selected: FormOption | null
  ): void {
    onChange(selected?.value ?? null);
  }

  const isEqual = (option: FormOption, selected: FormOption) => {
    return option?.value === selected?.value;
  };

  return (
    <Autocomplete
      disablePortal
      id={id}
      disabled={disabled}
      options={options}
      placeholder={label}
      onChange={handleChange}
      value={option}
      isOptionEqualToValue={isEqual}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="filled"
          error={!!error}
          helperText={helperText}
          required={required}
        />
      )}
    />
  );
}
