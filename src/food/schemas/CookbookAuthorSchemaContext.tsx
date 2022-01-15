import React from "react";
import { CookbookAuthor } from "../../common/client";
import { CookbookAuthorApi } from "../../common/client/FoodApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateLookupSchemaContextProps } from "../../core/components/forms/lookups/LookupSchema";
import { TableFilter } from "../../core/components/tables/SchemaTable";

const CookbookAuthorSchemaContext = React.createContext(
  {} as TableSchemaContextProps<CookbookAuthor, TableFilter>
);

function CookbookAuthorSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const contextProps = CreateLookupSchemaContextProps(
    "Cookbook Authors",
    CookbookAuthorApi
  );
  return (
    <CookbookAuthorSchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </CookbookAuthorSchemaContext.Provider>
  );
}

export { CookbookAuthorSchemaContext, CookbookAuthorSchemaContextProvider };
