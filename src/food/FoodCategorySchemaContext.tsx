import React from "react";
import { FoodCategory } from "../common/client";
import { FoodCategoryApi } from "../common/client/FoodApi";
import {
  lookupSchema,
  lookupFilterSchema,
} from "../core/components/forms/lookups/LookupSchema";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";

const FoodCategorySchemaContext = React.createContext(
  {} as EditSchemaContextProps<FoodCategory>
);

function FoodCategorySchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const add = (o: FoodCategory) => FoodCategoryApi.create(o);
  const save = (o: FoodCategory) => FoodCategoryApi.update(o.id as number, o);

  const contextProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...lookupSchema,
            object: {},
            type: "ADD",
            title: "New Product Category",
            save: add,
          };
        case "EDIT":
          return {
            ...lookupSchema,
            object: action.obj,
            type: "EDIT",
            title: "Edit Product Category",
            save: save,
          };
        case "FILTER":
          return {
            ...lookupFilterSchema,
            title: "Filter Product Category",
          };
      }
    },
  } as EditSchemaContextProps<FoodCategory>;

  return (
    <FoodCategorySchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </FoodCategorySchemaContext.Provider>
  );
}

export { FoodCategorySchemaContext, FoodCategorySchemaContextProvider };
