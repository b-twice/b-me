import React from "react";
import { CookbookAuthor } from "../common/client";
import { CookbookAuthorApi } from "../common/client/FoodApi";
import {
  lookupSchema,
  lookupFilterSchema,
} from "../core/components/forms/lookups/LookupSchema";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";

const CookbookAuthorSchemaContext = React.createContext(
  {} as EditSchemaContextProps<CookbookAuthor>
);

function CookbookAuthorSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const add = (o: CookbookAuthor) => CookbookAuthorApi.create(o);
  const save = (o: CookbookAuthor) =>
    CookbookAuthorApi.update(o.id as number, o);

  const contextProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...lookupSchema,
            object: {},
            type: "ADD",
            title: "New Cookbook Author",
            save: add,
          };
        case "EDIT":
          return {
            ...lookupSchema,
            object: action.obj,
            type: "EDIT",
            title: "Edit Cookbook Author",
            save: save,
          };
        case "FILTER":
          return {
            ...lookupFilterSchema,
            title: "Filter Cookbook Authors",
          };
      }
    },
  } as EditSchemaContextProps<CookbookAuthor>;

  return (
    <CookbookAuthorSchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </CookbookAuthorSchemaContext.Provider>
  );
}

export { CookbookAuthorSchemaContext, CookbookAuthorSchemaContextProvider };
