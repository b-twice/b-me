import React, { useState, useEffect, Fragment } from "react";
import FormAppBar from "./FormAppBar";
import FormOption from "./FormOptionType";
import SchemaFormField from "./fields/SchemaField";
import AppSnackbar from "../AppSnackbar";
import { styled } from "@mui/system";
import { Stack } from "@mui/material";
import numberFormatter from "../formatters/NumberFormatter";
import getLookupName from "./lookups/getLookupName";
import currencyFormatter from "../formatters/CurrencyFormatter";

const Root = styled("div")({
  flexGrow: 1,
  overflow: "auto",
  height: "100%",
});

export interface ListFormSchema<T> extends FormSchema<T> {
  display(obj: T): { id: string | number; name: string; path?: string };
}

export interface FormSchema<T> {
  properties: Partial<Record<keyof T, FieldSchema>>;
  readonly?: boolean;
  repeatAdd?: boolean;
  create?(obj: T): Promise<T>;
  update?(obj: T): Promise<T>;
  delete?(obj: T): Promise<void>;
}

type FieldType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "datetime"
  | "currency"
  | "select-menu"
  | "rating"
  | "switch";

export const FieldConstructor = {
  option: (obj: any, label: string, value: string | number | undefined) =>
    ({ ...obj, label: label, value: value } as FormOption),
  currency: (props: FieldConstructorOptions): FieldSchema => ({
    required: false,
    sortable: false,
    getVal: (value) => currencyFormatter.format(value),
    ...props,
    type: "currency",
  }),
  date: (props: FieldConstructorOptions): FieldSchema => ({
    required: false,
    ...props,
    type: "date",
  }),
  datetime: (props: FieldConstructorOptions): FieldSchema => ({
    required: false,
    ...props,
    type: "datetime",
  }),
  rating: (props: RatingFieldConstructorOptions): FieldSchema => ({
    required: false,
    ...props,
    type: "rating",
  }),
  switch: (props: FieldConstructorOptions): FieldSchema => ({
    required: false,
    ...props,
    type: "switch",
  }),
  multiSelect: (props: SelectFieldConstructorOptions): FieldSchema => ({
    required: false,
    getVal: getLookupName,
    ...props,
    type: "multiselect",
  }),
  number: (props: FieldConstructorOptions): FieldSchema => ({
    required: false,
    getVal: (value) => numberFormatter.format(value),
    ...props,
    type: "number",
  }),
  select: (props: SelectFieldConstructorOptions): FieldSchema => ({
    required: false,
    ...props,
    type: "select",
  }),
  selectMenu: (
    props: SelectFieldConstructorOptions
  ): SelectMenuFieldSchema => ({
    required: false,
    ...props,
    type: "select-menu",
  }),
  text: (props: TextFieldConstructorOptions): FieldSchema => ({
    required: false,
    ...props,
    type: "text",
  }),
};

export type FieldConstructorOptions = Omit<FieldSchema, "type">;
export type SelectFieldConstructorOptions = Omit<SelectFieldSchema, "type">;
export type TextFieldConstructorOptions = Omit<TextFieldSchema, "type">;
export type RatingFieldConstructorOptions = Omit<RatingFieldSchema, "type">;

export interface FieldSchema {
  title: string;
  type: FieldType;
  sortable?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  visible?: boolean;
  // method to retrieve value
  getVal?(value: any, row: any): any;
  // modify values on load/save
  transform?(changeObj: any[]): string | number | string[] | number[]; // optional transform value on submit
}

export interface TextFieldSchema extends FieldSchema {
  type: "text";
  path?: (o: any) => string | undefined; // url link
}

export interface RatingFieldSchema extends FieldSchema {
  type: "rating";
  max?: number;
  size?: "small" | "medium" | "large" | undefined;
  icon?: string;
}

export interface NumberFieldSchema extends FieldSchema {
  type: "number";
}

export interface SwitchFieldSchema extends FieldSchema {
  type: "switch";
}

export interface CurrencyFieldSchema extends FieldSchema {
  type: "currency";
}

export interface DateFieldSchema extends FieldSchema {
  type: "date";
}

export interface DateTimeFieldSchema extends FieldSchema {
  type: "datetime";
}

export interface SelectFieldSchema extends FieldSchema {
  type: "select";
  options: FormOption[];
}

export interface SelectMenuFieldSchema extends FieldSchema {
  type: "select-menu";
  options: FormOption[];
}

export interface MultiSelectFieldSchema extends FieldSchema {
  type: "multiselect";
  options: FormOption[];
}

export type SchemaFormStates = "EDIT" | "ADD" | "FILTER";

interface SchemaFormProps<T> {
  state: SchemaFormStates;
  inputObject: T;
  schema: FormSchema<T>;
  onCancel(): void;
  onSaveSuccess(obj: T): void;
  onChange?(obj: T, changeObj: Partial<T>): void;
  saveText?: string;
}

const titles: Record<SchemaFormStates, string> = {
  EDIT: "Edit",
  ADD: "New",
  FILTER: "Filter",
};

export default function SchemaForm<T>({
  state,
  schema,
  inputObject,
  onCancel,
  onSaveSuccess,
  onChange,
  saveText,
}: SchemaFormProps<T>) {
  const [obj, setObject] = useState<T>({} as T);
  const [properties, setProperties] = useState<Record<string, FieldSchema>>({});
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [appMessage, setAppMessage] = React.useState("");

  useEffect(() => {
    setObject(inputObject);
  }, [inputObject]);

  useEffect(() => {
    setProperties(schema.properties as Record<string, FieldSchema>);
  }, [schema.properties]);

  const handleChange = (changeObj: Partial<T>) => {
    const updatedObj = { ...obj, ...changeObj };
    setObject(updatedObj);
    // propogate changes up, in the case we need to update schema on value change
    if (onChange) {
      onChange(updatedObj, changeObj);
    }
  };
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSaving(true);
    evt.stopPropagation();
    evt.preventDefault();
    const passed = validate();
    if (!passed) {
      setIsSaving(false);
      return;
    }
    const saveObj = transform();
    if (state === "ADD" && schema.create) {
      schema
        .create(saveObj)
        .then((result) => {
          onSaveSuccess(result || saveObj);
        })
        .catch((err) => {
          console.error(err);
          setAppMessage("Failed to save, unexpected error.");
          setIsSaving(false);
        });
    } else if (state === "EDIT" && schema.update) {
      schema
        .update(saveObj)
        .then((result) => {
          onSaveSuccess(result || saveObj);
        })
        .catch((err) => {
          console.error(err);
          setAppMessage("Failed to save, unexpected error.");
          setIsSaving(false);
        });
    } else {
      onSaveSuccess(saveObj);
    }
  };

  const validate = (): boolean => {
    let errors: Record<string, any> = {};
    let op: Record<string, any> = obj;
    Object.entries(properties)
      .filter(([prop, fieldSchema]) => fieldSchema.visible !== false)
      .forEach(([prop, fieldSchema]) => {
        if (
          fieldSchema.required &&
          (op[prop] === undefined || op[prop] === null || op[prop] === "")
        ) {
          errors[prop] = `${fieldSchema.title} is required.`;
        } else if (
          (fieldSchema.type === "currency" || fieldSchema.type === "number") &&
          !!isNaN(op[prop] - parseFloat(op[prop]))
        ) {
          errors[prop] = `${fieldSchema.title} must be a number.`;
        }
      });
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  // Modify value on submit, if needed
  const transform = (): T => {
    let result: Record<string, any> = { ...obj };
    (Object.entries(schema.properties) as [string, FieldSchema][]).forEach(
      ([prop, fieldSchema]) => {
        if (fieldSchema.visible === false) {
          result[prop] = null;
        } else if (fieldSchema.transform) {
          result[prop] = fieldSchema.transform(
            (obj as Record<string, any>)[prop]
          );
        }
      }
    );
    return result as T;
  };

  return (
    <Fragment>
      <Root>
        <form onSubmit={handleSubmit} noValidate={true}>
          <FormAppBar
            title={titles[state]}
            onCancel={onCancel}
            isSaving={isSaving}
            saveText={saveText}
          />
          <Stack spacing={2} sx={{ p: 2 }}>
            {Object.entries(properties).map(([k, v]) => (
              <SchemaFormField<T>
                property={k}
                obj={obj}
                schema={v}
                onChange={handleChange}
                key={k}
                error={error[k]}
              />
            ))}
          </Stack>
        </form>
      </Root>
      <AppSnackbar message={appMessage} onClose={() => setAppMessage("")} />
    </Fragment>
  );
}
