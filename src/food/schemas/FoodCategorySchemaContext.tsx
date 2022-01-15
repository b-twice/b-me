import React from "react";
import { FoodCategory } from "../../common/client";
import { FoodCategoryApi } from "../../common/client/FoodApi";
import { TableSchemaContextProps } from "../../core/components/forms/EditSchemaContextProps.interface";
import { CreateLookupSchemaContextProps } from "../../core/components/forms/lookups/LookupSchema";
import { TableFilter } from "../../core/components/tables/SchemaTable";

const FoodCategorySchemaContext = React.createContext(
  {} as TableSchemaContextProps<FoodCategory, TableFilter>
);

function FoodCategorySchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const contextProps = CreateLookupSchemaContextProps(
    "Product Categories",
    FoodCategoryApi
  );
  return (
    <FoodCategorySchemaContext.Provider value={{ ...contextProps }}>
      {children}
    </FoodCategorySchemaContext.Provider>
  );
}

export { FoodCategorySchemaContext, FoodCategorySchemaContextProvider };
