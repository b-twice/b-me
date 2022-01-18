import React, { useState, useEffect } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormOption from "../FormOptionType";
import { MenuItem, FormControl, InputLabel } from "@mui/material";

interface SelectProps {
  label: string;
  id: string;
  options: FormOption[];
  obj: { [key: string]: any } | undefined;
  valueProperty: string;
  labelProperty: string;
  required: boolean;
  error: string;
  helperText?: string;
  disabled?: boolean;
  onChange(obj: FormOption): void;
}

export default function FormSelectMenu({
  label,
  id,
  options,
  obj,
  valueProperty,
  labelProperty,
  required,
  onChange,
  error,
  helperText,
  disabled,
}: SelectProps) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (obj !== undefined) {
      setValue(obj[valueProperty] || "");
    }
  }, [obj, valueProperty, labelProperty]);

  function handleChange(
    event: SelectChangeEvent<string>
    // event: React.ChangeEvent<{
    //   label?: unknown;
    //   name?: unknown;
    //   value: unknown;
    // }>
  ): void {
    onChange({
      [labelProperty]: event.target.name,
      [valueProperty]: event.target.value,
    } as FormOption);
  }

  return (
    <FormControl variant="filled">
      <InputLabel id={id + "-label"}>{label}</InputLabel>
      <Select
        id={id}
        placeholder={label}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        error={!!error}
      >
        {!required && <MenuItem value=""> </MenuItem>}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
