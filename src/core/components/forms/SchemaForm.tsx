import React, { useState, useEffect, Fragment } from "react";
import FormAppBar from "./FormAppBar";
import FormOptionType from "./FormOptionType";
import SchemaFormField from "./fields/SchemaField";
import AppSnackbar from "../AppSnackbar";
import { ObjectEntity } from "./ObjectEntityType";
import { styled } from "@mui/system";
import { Stack } from "@mui/material";

const Root = styled("div")({
  flexGrow: 1,
  overflow: "auto",
  height: "100%",
});

export interface FormSchema<T> {
  type: "EDIT" | "ADD" | "FILTER";
  title: string;
  properties: { [key: string]: FieldSchema };
  object: T;
  save(obj: { [key: string]: any }): Promise<any>;
}

type FieldType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "currency"
  | "select-menu"
  | "rating"
  | "switch";

export interface FieldSchema {
  title: string;
  type: FieldType;
  required: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  visible?: boolean;
  // method to retrieve value
  getVal?(value: any): any;
  // modify values on load/save
  load?(value: any): any; // optional set value on load
  transform?(
    changeObj: ObjectEntity | ObjectEntity[]
  ): string | number | string[] | number[]; // optional transform value on submit
}

export interface TextFieldSchema extends FieldSchema {
  type: "text";
  path?: (o: any) => string; // url link
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

export interface SelectFieldSchema extends FieldSchema {
  type: "select";
  options: FormOptionType[];
}

export interface SelectMenuFieldSchema extends FieldSchema {
  type: "select-menu";
  options: FormOptionType[];
}

export interface MultiSelectFieldSchema extends FieldSchema {
  type: "multiselect";
  options: FormOptionType[];
}

interface SchemaFormProps<T> {
  schema: FormSchema<T>;
  onCancel(): void;
  onSaveSuccess(obj: { [key: string]: any }): void;
  onChange?(
    obj: { [key: string]: any },
    changeObj: { [key: string]: any }
  ): void;
  saveText?: string;
}

export default function SchemaForm<T extends ObjectEntity>({
  schema,
  onCancel,
  onSaveSuccess,
  onChange,
  saveText,
}: SchemaFormProps<T>) {
  const [obj, setObject] = useState<T>({} as T);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [appMessage, setAppMessage] = React.useState("");

  useEffect(() => {
    // Modify value on load, if needed
    const load = (): T => {
      let result = { ...schema.object };
      Object.entries(schema.properties).forEach(([prop, fieldSchema]) => {
        if (fieldSchema.load) {
          (result as ObjectEntity)[prop] = fieldSchema.load(
            schema.object[prop]
          );
        }
      });
      return result;
    };
    setObject(load());
  }, [schema.object, schema.properties]);

  const handleChange = (changeObj: { [key: string]: any }) => {
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
    schema
      .save(saveObj)
      .then((result) => {
        onSaveSuccess(result || saveObj);
      })
      .catch((err) => {
        console.error(err);
        setAppMessage("Failed to save, unexpected error.");
        setIsSaving(false);
      });
  };

  const validate = (): boolean => {
    let errors: { [key: string]: any } = {};
    Object.entries(schema.properties)
      .filter(([prop, fieldSchema]) => fieldSchema.visible !== false)
      .forEach(([prop, fieldSchema]) => {
        if (
          fieldSchema.required &&
          (obj[prop] === undefined || obj[prop] === null || obj[prop] === "")
        ) {
          errors[prop] = `${fieldSchema.title} is required.`;
        } else if (
          (fieldSchema.type === "currency" || fieldSchema.type === "number") &&
          !!isNaN(obj[prop] - parseFloat(obj[prop]))
        ) {
          errors[prop] = `${fieldSchema.title} must be a number.`;
        }
      });
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  // Modify value on submit, if needed
  const transform = (): T => {
    let result = { ...obj };
    Object.entries(schema.properties).forEach(([prop, fieldSchema]) => {
      if (fieldSchema.visible === false) {
        (result as ObjectEntity)[prop] = null;
      } else if (fieldSchema.transform) {
        (result as ObjectEntity)[prop] = fieldSchema.transform(obj[prop]);
      }
    });
    return result;
  };

  return (
    <Fragment>
      <Root>
        <form onSubmit={handleSubmit} noValidate={true}>
          <FormAppBar
            title={schema.title}
            onCancel={onCancel}
            isSaving={isSaving}
            saveText={saveText}
          />
          <Stack spacing={2} sx={{ p: 2 }}>
            {Object.entries(schema.properties).map(([k, v]) => (
              <SchemaFormField
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
