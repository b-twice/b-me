import React, { useState, useEffect } from "react";
import FormOptionType from "../FormOptionType";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface MultiSelectProps {
  label: string;
  id: string;
  options: FormOptionType[];
  items: { [key: string]: any }[] | undefined;
  valueProperty: string;
  labelProperty: string;
  required: boolean;
  error: string;
  helperText?: string;
  disabled?: boolean;
  onChange(obj: { [key: string]: any }): void;
}

export default function FormMultiSelect({
  label,
  id,
  options,
  items,
  valueProperty,
  labelProperty,
  required,
  onChange,
  error,
  disabled,
  helperText,
}: MultiSelectProps) {
  const [values, setValues] = useState<FormOptionType[] | undefined>([]);

  useEffect(() => {
    if (items !== undefined) {
      setValues(
        items.map((item) => ({
          ...item,
          value: item[valueProperty],
          label: item[labelProperty],
        })) as FormOptionType[]
      );
    }
  }, [items, valueProperty, labelProperty]);

  function handleChange(event: any, selected: FormOptionType[]): void {
    const values = selected.map<{ [key: string]: any }>((item) => ({
      ...item,
      [labelProperty]: item.label,
      [valueProperty]: item.value,
    }));
    onChange(values);
  }

  const isEqual = (option: FormOptionType, selected: FormOptionType) => {
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
          helperText={helperText}
          required={required}
        />
      )}
    />
  );
}
