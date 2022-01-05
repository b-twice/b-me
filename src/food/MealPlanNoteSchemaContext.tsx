import React, { useEffect, useState } from "react";
import {
  FormSchema,
  SelectFieldSchema,
  TextFieldSchema,
} from "../core/components/forms/SchemaForm";
import { MealPlanNote } from "../common/client";
import { MealPlanNoteApi } from "../common/client/FoodApi";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import getLookupName from "../core/components/forms/lookups/getLookupName";

const MealPlanNoteSchemaContext = React.createContext(
  {} as EditSchemaContextProps<MealPlanNote>
);

const propertyOf = (e: keyof MealPlanNote) => e;

function MealPlanNoteSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const schema = {
    title: "",
    properties: {
      [propertyOf("mealPlan")]: {
        title: "MealPlan",
        type: "select",
        options: [],
        disabled: true,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [propertyOf("content")]: {
        title: "Note",
        type: "text",
        required: false,
      } as TextFieldSchema,
    },
    object: {} as MealPlanNote,
  } as FormSchema<MealPlanNote>;

  const add = (o: MealPlanNote) => MealPlanNoteApi.create(o);
  const save = (o: MealPlanNote) => MealPlanNoteApi.update(o.id as number, o);

  const editProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: action.obj,
            type: "ADD",
            title: "New MealPlan Note",
            save: add,
          } as FormSchema<MealPlanNote>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit MealPlan Note",
            save: save,
          } as FormSchema<MealPlanNote>;
      }
    },
  } as EditSchemaContextProps<MealPlanNote>;

  return (
    <MealPlanNoteSchemaContext.Provider value={{ ...editProps }}>
      {children}
    </MealPlanNoteSchemaContext.Provider>
  );
}

export { MealPlanNoteSchemaContext, MealPlanNoteSchemaContextProvider };
