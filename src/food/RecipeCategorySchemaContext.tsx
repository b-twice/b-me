import React from "react";
import { RecipeCategory } from "../common/client";
import { RecipeCategoryApi } from "../common/client/FoodApi";
import {
  lookupSchema,
  lookupFilterSchema,
} from "../core/components/forms/lookups/LookupSchema";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";

const RecipeCategorySchemaContext = React.createContext(
  {} as EditSchemaContextProps<RecipeCategory>
);

function RecipeCategorySchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const add = (o: RecipeCategory) => RecipeCategoryApi.create(o);
  const save = (o: RecipeCategory) =>
    RecipeCategoryApi.update(o.id as number, o);

  const contextProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...lookupSchema,
            object: {},
            type: "ADD",
            title: "New Recipe Category",
            save: add,
          };
        case "EDIT":
          return {
            ...lookupSchema,
            object: action.obj,
            type: "EDIT",
            title: "Edit Recipe Category",
            save: save,
          };
        case "FILTER":
          return {
            ...lookupFilterSchema,
            title: "Filter Recipe Category",
          };
      }
    },
  } as EditSchemaContextProps<RecipeCategory>;

  return (
    <RecipeCategorySchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </RecipeCategorySchemaContext.Provider>
  );
}

export { RecipeCategorySchemaContext, RecipeCategorySchemaContextProvider };
