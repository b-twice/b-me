import React, { Fragment } from "react";
import {
  TextFieldSchema,
  SelectFieldSchema,
  FieldSchema,
  MultiSelectFieldSchema,
  DateFieldSchema,
  CurrencyFieldSchema,
  SelectMenuFieldSchema,
  SwitchFieldSchema,
  NumberFieldSchema,
  RatingFieldSchema,
} from "../SchemaForm";
import SchemaFormSelect from "./SchemaFormSelect";
import SchemaFormText from "./SchemaFormText";
import SchemaFormMultiSelect from "./SchemaFormMultiSelect";
import SchemaFormDate from "./SchemaFormDate";
import SchemaFormCurrency from "./SchemaFormCurrency";
import SchemaFormSelectMenu from "./SchemaFormSelectMenu";
import SchemaFormSwitch from "./SchemaFormSwitch";
import SchemaFormNumber from "./SchemaFormNumber";
import SchemaFormRating from "./SchemaFormRating";

export interface SchemaFieldProps<T> {
  property: string;
  schema: T;
  obj: { [key: string]: any };
  error: string;
  onChange: (obj: { [key: string]: any }) => void;
}

export default function SchemaFormField(
  props: SchemaFieldProps<
    | TextFieldSchema
    | MultiSelectFieldSchema
    | SelectFieldSchema
    | DateFieldSchema
    | FieldSchema
    | CurrencyFieldSchema
    | RatingFieldSchema
    | SwitchFieldSchema
  >
) {
  if (props.schema.visible === false) return <Fragment />;
  switch (props.schema.type) {
    case "text":
      return (
        <SchemaFormText {...(props as SchemaFieldProps<TextFieldSchema>)} />
      );
    case "number":
      return (
        <SchemaFormNumber {...(props as SchemaFieldProps<NumberFieldSchema>)} />
      );
    case "switch":
      return (
        <SchemaFormSwitch {...(props as SchemaFieldProps<SwitchFieldSchema>)} />
      );
    case "currency":
      return (
        <SchemaFormCurrency
          {...(props as SchemaFieldProps<CurrencyFieldSchema>)}
        />
      );
    case "rating":
      return (
        <SchemaFormRating {...(props as SchemaFieldProps<RatingFieldSchema>)} />
      );
    case "date":
      return (
        <SchemaFormDate {...(props as SchemaFieldProps<DateFieldSchema>)} />
      );
    case "select":
      return (
        <SchemaFormSelect {...(props as SchemaFieldProps<SelectFieldSchema>)} />
      );
    case "select-menu":
      return (
        <SchemaFormSelectMenu
          {...(props as SchemaFieldProps<SelectMenuFieldSchema>)}
        />
      );
    case "multiselect":
      return (
        <SchemaFormMultiSelect
          {...(props as SchemaFieldProps<MultiSelectFieldSchema>)}
        />
      );
  }
}
