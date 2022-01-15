import React from "react";
import { RecipeCategory } from "../../common/client";
import { RecipeCategoryApi } from "../../common/client/FoodApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateLookupSchemaContextProps } from "../../core/components/forms/lookups/LookupSchema";
import { TableFilter } from "../../core/components/tables/SchemaTable";

const RecipeCategorySchemaContext = React.createContext(
  {} as TableSchemaContextProps<RecipeCategory, TableFilter>
);

function RecipeCategorySchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const contextProps = CreateLookupSchemaContextProps(
    "Recipe Categories",
    RecipeCategoryApi
  );
  return (
    <RecipeCategorySchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </RecipeCategorySchemaContext.Provider>
  );
}

export { RecipeCategorySchemaContext, RecipeCategorySchemaContextProvider };
