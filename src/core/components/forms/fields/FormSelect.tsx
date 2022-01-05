import React, { useState, useEffect, CSSProperties } from "react";
import { useTheme } from "@material-ui/core/styles";
import Select from "react-select";
import FormOptionType from "../FormOptionType";
import { ValueType } from "react-select/src/types";
import {
  Control,
  Menu,
  SingleValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
  useSelectStyles,
} from "./SelectComponents";

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

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
  const classes = useSelectStyles();
  const theme = useTheme();

  const [option, setOption] = useState<ValueType<FormOptionType>>(null);
  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

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
    }
  }, [obj, valueProperty, labelProperty, options]);

  function handleChange(selected: any): void {
    selected = selected as FormOptionType;
    onChange({
      ...selected,
      [labelProperty]: selected.label,
      [valueProperty]: selected.value,
    });
  }

  return (
    <Select
      classes={classes}
      styles={selectStyles}
      inputId={id}
      isDisabled={disabled}
      TextFieldProps={{
        disabled: disabled,
        label: label,
        variant: "filled",
        error: !!error,
        helperText: helperText,
        InputLabelProps: {
          htmlFor: id,
          shrink: true,
        },
      }}
      placeholder={label}
      options={options}
      components={components}
      value={option}
      onChange={handleChange}
      required={required}
    />
  );
}
