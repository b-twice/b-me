import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormOptionType from "../FormOptionType";
import Autocomplete from "@mui/material/Autocomplete";

interface SelectProps {
  label: string;
  id: string;
  options: FormOptionType[];
  obj: { [key: string]: any } | undefined;
  valueProperty: string;
  labelProperty: string;
  required: boolean;
  error: string;
  helperText?: string;
  disabled?: boolean;
  onChange(obj: { [key: string]: any }): void;
}

export default function FormSelect({
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
  const [option, setOption] = useState<FormOptionType | null>(null);
  useEffect(() => {
    if (obj !== undefined && obj !== null) {
      let label = obj[labelProperty];
      if (label === undefined) {
        label = options.find((o) => o.value === obj[valueProperty])?.label;
      }
      setOption({
        ...obj,
        value: obj[valueProperty],
        label: label,
      } as FormOptionType);
    } else {
      setOption(null);
    }
  }, [obj, valueProperty, labelProperty, options]);

  function handleChange(selected: any, newValue: any): void {
    onChange(
      newValue === null
        ? newValue
        : {
            ...newValue,
          }
    );
  }

  const isEqual = (option: FormOptionType, selected: FormOptionType) => {
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
