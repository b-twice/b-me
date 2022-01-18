import Reacti from "react";
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
  DateTimeFieldSchema,
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
import SchemaFormDateTime from "./SchemaFormDateTime";

export interface SchemaFieldProps<T, S> {
  property: string;
  schema: S;
  obj: T;
  error: string;
  onChange: (obj: Partial<T>) => void;
}

export default function SchemaFormField<T>(
  props: SchemaFieldProps<
    T,
    | TextFieldSchema
    | MultiSelectFieldSchema
    | SelectFieldSchema
    | DateFieldSchema
    | DateTimeFieldSchema
    | NumberFieldSchema
    | FieldSchema
    | CurrencyFieldSchema
    | RatingFieldSchema
    | SwitchFieldSchema
  >
) {
  if (props.schema.visible === false) return <></>;
  switch (props.schema.type) {
    case "text":
      return (
        <SchemaFormText {...(props as SchemaFieldProps<T, TextFieldSchema>)} />
      );
    case "number":
      return (
        <SchemaFormNumber
          {...(props as SchemaFieldProps<T, NumberFieldSchema>)}
        />
      );
    case "switch":
      return (
        <SchemaFormSwitch
          {...(props as SchemaFieldProps<T, SwitchFieldSchema>)}
        />
      );
    case "currency":
      return (
        <SchemaFormCurrency
          {...(props as SchemaFieldProps<T, CurrencyFieldSchema>)}
        />
      );
    case "rating":
      return (
        <SchemaFormRating
          {...(props as SchemaFieldProps<T, RatingFieldSchema>)}
        />
      );
    case "date":
      return (
        <SchemaFormDate {...(props as SchemaFieldProps<T, DateFieldSchema>)} />
      );
    case "datetime":
      return (
        <SchemaFormDateTime
          {...(props as SchemaFieldProps<T, DateTimeFieldSchema>)}
        />
      );
    case "select":
      return (
        <SchemaFormSelect
          {...(props as SchemaFieldProps<T, SelectFieldSchema>)}
        />
      );
    case "select-menu":
      return (
        <SchemaFormSelectMenu
          {...(props as SchemaFieldProps<T, SelectMenuFieldSchema>)}
        />
      );
    case "multiselect":
      return (
        <SchemaFormMultiSelect
          {...(props as SchemaFieldProps<T, MultiSelectFieldSchema>)}
        />
      );
  }
}
