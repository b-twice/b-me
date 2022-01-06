import React from "react";
import {
  FormSchema,
  SelectFieldSchema,
  TextFieldSchema,
} from "../core/components/forms/SchemaForm";
import { RecipeNote } from "../common/client";
import { RecipeNoteApi } from "../common/client/FoodApi";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import getLookupName from "../core/components/forms/lookups/getLookupName";

const RecipeNoteSchemaContext = React.createContext(
  {} as EditSchemaContextProps<RecipeNote>
);

const propertyOf = (e: keyof RecipeNote) => e;

function RecipeNoteSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const schema = {
    title: "",
    properties: {
      [propertyOf("recipe")]: {
        title: "Recipe",
        type: "select",
        options: [],
        required: true,
        disabled: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("content")]: {
        title: "Note",
        type: "text",
        required: true,
      } as TextFieldSchema,
    },
    object: {} as RecipeNote,
  } as FormSchema<RecipeNote>;

  const add = (o: RecipeNote) => RecipeNoteApi.create(o);
  const save = (o: RecipeNote) => RecipeNoteApi.update(o.id as number, o);

  const editProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: action.obj,
            type: "ADD",
            title: "New Recipe Note",
            save: add,
          } as FormSchema<RecipeNote>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit Recipe Note",
            save: save,
          } as FormSchema<RecipeNote>;
      }
    },
  } as EditSchemaContextProps<RecipeNote>;

  return (
    <RecipeNoteSchemaContext.Provider value={{ ...editProps }}>
      {children}
    </RecipeNoteSchemaContext.Provider>
  );
}

export { RecipeNoteSchemaContext, RecipeNoteSchemaContextProvider };
